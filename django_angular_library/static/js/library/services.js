'use strict';
angular.module('bookApp')

.factory('dataFactory', ['$http', function($http) {

    var dataFactory = {};

    

     dataFactory.printBarcodes = function () {
        var urlbookbarcodePrint = '/admin/library/api/book/print_barcodes/';
       return $http.get(urlbookbarcodePrint);
    };

    dataFactory.getBookTypes = function () {
        var urlbooktypeGet = '/admin/library/api/book-type/list/';
       return $http.get(urlbooktypeGet);
    };

    dataFactory.insertBook = function (book) {
        var urlbookPost = '/admin/library/api/book/post/';
       return $http.post(urlbookPost, book);
    };
    dataFactory.updateBook = function (book) {
        var urlbookUpdate = '/admin/library/api/book/update/'+book.id;
       return $http.put(urlbookUpdate, book);
    };
    dataFactory.getAllBooks = function () {
        var urlbookGet = '/admin/library/api/book/list/';
       return $http.get(urlbookGet);
    };
    dataFactory.deleteBook = function (book) {
        var urlbookDelete = '/admin/library/api/book/update/'+book.id;
        return $http.delete(urlbookDelete, book);
    };

    dataFactory.getStudentByCardId = function (id) {
        var urlstudentGet = '/student/api/registration/'+id;
       return $http.get(urlstudentGet);
    };
    
    dataFactory.getBookByBarcode = function (barcode) {
        var urlbookGet = '/admin/library/api/book/'+barcode;
       return $http.get(urlbookGet);
    };
    dataFactory.issueBook = function (bookIssue) {
        var urlbookIssuePost = '/admin/library/api/book/issue/post/';
       return $http.post(urlbookIssuePost, bookIssue);
    };
    dataFactory.getBookBorrowByStudent = function(id){
         var urlbookBorrow = '/admin/library/api/book/issue/'+id;
       return $http.get(urlbookBorrow);

    }
    dataFactory.createBarcode = function () {
        var urlbookBarcodes = '/admin/library/api/book/update_barcodes/';
       return $http.post(urlbookBarcodes);
    };

     dataFactory.updateBookIssue = function (book_issue) {
        var urlbookUpdate = '/admin/library/api/book/issue/update/'+book_issue.id;
       return $http.put(urlbookUpdate, book_issue);
    };
    dataFactory.returnBook = function (book_return) {
       
       var urlbookDelete = '/admin/library/api/book/issue/update/'+book_return.id;
        return $http.delete(urlbookDelete, book_return);
    };
   

    dataFactory.getBookIssuedByBarcode = function (barcode) {
        var urlbookGet = '/admin/library/api/book/borrow/'+barcode;
       return $http.get(urlbookGet);
    };
     dataFactory.getBookFine = function (id) {
        var urlbookFine = '/admin/library/api/book/fine/'+id;
       return $http.get(urlbookFine);
    };
    dataFactory.payBookFine = function (id) {
        var urlbookFine = '/admin/library/api/book/fine/'+id;
       return $http.put(urlbookFine);
    };
    
    return dataFactory;
}]);

