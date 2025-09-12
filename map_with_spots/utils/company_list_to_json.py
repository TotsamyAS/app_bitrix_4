from django.http import JsonResponse

from integration_utils.bitrix24.bitrix_user_auth.main_auth import main_auth


@main_auth(on_cookies=True)
def company_list_to_json(request):
    but = request.bitrix_user_token

    params ={}
    params = {
        'SELECT': ['ID', 'TITLE']
    }
    all_companies = but.call_list_method('crm.company.list', params)
    all_companies = {company['ID']: company for company in all_companies}

    if len(all_companies) == 0:
        print(f'Ошибка при поиске компаний: {all_companies}')
        return JsonResponse({})
    print('>> завершено получение компаний через api', all_companies)

    all_addresses = but.call_list_method('crm.address.list', {
        'ORDER': {'TYPE_ID': 'ASC'},
        'SELECT': ['ADDRESS_2', 'ANCHOR_ID']

    })
    if len(all_addresses) == 0:
        print(f'Ошибка при поиске адресов: {all_addresses}')
        return JsonResponse({})
    print('>> завершено получение адресов через api', all_addresses)
    companies_with_address = {}
    for address in all_addresses:
        company_id = address['ANCHOR_ID']
        if not all_companies[company_id]:
            continue
        company = companies_with_address.setdefault(company_id, {})
        company['ADDRESS'] = address['ADDRESS_2']
        company['TITLE'] = all_companies[company_id]['TITLE']
    print('>> завершено получение компаний с их адресами', companies_with_address)
    return JsonResponse(companies_with_address)