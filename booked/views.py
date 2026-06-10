from django.http import HttpResponse, HttpResponseNotFound

def serve_favicon(request):
    try:
        with open("favicon.ico", "rb") as f:
            return HttpResponse(f.read(), content_type="image/x-icon")
    except FileNotFoundError:
        return HttpResponseNotFound()