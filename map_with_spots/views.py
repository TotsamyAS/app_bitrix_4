from django.http import JsonResponse
from django.shortcuts import render

from integration_utils.bitrix24.bitrix_user_auth.main_auth import main_auth
from integration_utils.vendors.telegram.vendor.ptb_urllib3.urllib3 import HTTPResponse


def common_index_function(request):

    but = request.bitrix_user_token
    all_companies = but.call_list_method('crm.company.list',{
        'SELECT': ['ID', 'TITLE']
    })
    all_companies = {company['ID']: company for company in all_companies}

    if len(all_companies) == 0:
        return HTTPResponse(f'Ошибка при поиске компаний: {all_companies}', status=404)
    all_addresses = but.call_list_method('crm.address.list',{
        'ORDER': {'TYPE_ID': 'ASC'},
        'SELECT': ['ADDRESS_1', 'CITY', 'PROVINCE', 'COUNTRY', 'ANCHOR_ID']

    })
    if len(all_addresses) == 0:
        return HTTPResponse(f'Ошибка при поиске адресов: {all_addresses}', status=404)

    companies_with_address = {}
    for address in all_addresses:
        company_id = address['ANCHOR_ID']
        if not all_companies[company_id]:
            continue
        company = companies_with_address.setdefault(company_id, {})
        company.setdefault('ADDRESS',[]).append(address)
        company['TITLE'] = all_companies[company_id]['TITLE']

    context = {}
    # comp_id = but.call_list_method('crm.company.list')
    # address = but.call_list_method('crm.address.list')
    return render(request, 'index.html', locals())

@main_auth(on_start=True, set_cookie=True)
def start_index(request):
    return common_index_function(request)

@main_auth(on_cookies=True)
def index_after(request):
    return common_index_function(request)