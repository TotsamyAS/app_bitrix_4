"""
URL configuration for bitrix_app_4 project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from map_with_spots import views
from map_with_spots.utils.company_list_to_json import company_list_to_json

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.start_index, name="start_index"),
    path('index_after/', views.index_after, name="index_after"),
    path('company_list/', company_list_to_json, name="company_list_to_json"),
]
