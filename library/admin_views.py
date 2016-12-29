
# from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import TemplateView, View
from django.shortcuts import render_to_response
from django.template import RequestContext

# Create your views here.


class LibraryBookView(TemplateView):
    """Adding books"""
    template_name = 'library/add_book.html'

    # def test_func(self):
    #     return self.request.user.is_superuser

    def get_context_data(self, **kwargs):
        context = super(
            LibraryBookView, self).get_context_data(**kwargs)
        return context


class LibraryListingView(TemplateView):
    """All book listing"""
    template_name = 'library/book_listing.html'

    # def test_func(self):
    #     return self.request.user.is_superuser

    def get_context_data(self, **kwargs):
        context = super(
            LibraryListingView, self).get_context_data(**kwargs)

        return context


class LibraryBookIssueView(View):
    """ Issue Book """
    template_name = 'library/issue_book.html'

    # def test_func(self):
    #     return self.request.user.is_superuser

    def get(self, request, *args, **kwargs):
        parameters = {}
        cid = request.GET.get('cid', '')
        parameters['set_cid'] = False
        if cid:
            parameters['set_cid'] = True
            # student = Student.objects.active().get(
            #     registration_number=cid)
            # parameters['student'] = student
        return render_to_response(
            'library/issue_book.html',
            parameters,
            context_instance=RequestContext(request)
        )


class LibraryBookReturnView(View):
    """ Issue Book """
    template_name = 'library/return_book.html'

    # def test_func(self):
    #     return self.request.user.is_superuser

    def get(self, request, *args, **kwargs):
        parameters = {}
        bar_code = request.GET.get('bar_code', '')
        parameters['set_barcode'] = False
        if bar_code:
            parameters['set_barcode'] = True
        return render_to_response(
            'library/return_book.html',
            parameters,
            context_instance=RequestContext(request)
        )
