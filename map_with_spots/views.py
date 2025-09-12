from django.http import JsonResponse
from django.shortcuts import render

from integration_utils.bitrix24.bitrix_user_auth.main_auth import main_auth
from integration_utils.vendors.telegram.vendor.ptb_urllib3.urllib3 import HTTPResponse


def common_index_function(request):
    return render(request, 'index.html', locals())

@main_auth(on_start=True, set_cookie=True)
def start_index(request):
    return common_index_function(request)

@main_auth(on_cookies=True)
def index_after(request):
    return common_index_function(request)