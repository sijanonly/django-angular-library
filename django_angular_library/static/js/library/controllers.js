'use strict';
angular.module('bookApp')

.controller('BookAddController', ['$scope', 'dataFactory', 'Flash', '$uibModal',
    function($scope, dataFactory, Flash, $uibModal) {

        $scope.initDataTable = function() {
   $timeout(function() {
      $("#noCampaignData").hide();
      //$("#example_paginate").hide();
      var rowCount = $("#example tr").length;
      console.log("Row count value is"+rowCount);
      if (rowCount >= 0) {
         console.log("Entered into Sorting");
         $("#example").dataTable({
            "pagingType" : "full_numbers",
            "order" : [ [ 2, "desc" ] ]
         });
      }
   }, 200)
}
        $scope.books = 'books';
        $scope.book = {};
        $scope.publisher = {};
        $scope.tags = [];

        $scope.authors = [];
        $scope.addField = function() {
            $scope.authors.push({ name: '' })
            return;
        }

        $scope.removeField = function(index) {
            if (confirm('Are you sure you want to delete this?')) {
                // TODO:  Do something here if the answer is "Ok".
                $scope.authors.splice(index, 1);
            }
        }


        $scope.steps = [
            'Step 1: Book Info',
            'Step 2: Publisher Info',
            'Step 3: Authors Info',
            'Step 4: Extra Info'
        ];
        $scope.selection = $scope.steps[0];

        $scope.getCurrentStepIndex = function() {
            // Get the index of the current step given selection
            return _.indexOf($scope.steps, $scope.selection);
        };

        // Go to a defined step index
        $scope.goToStep = function(index) {
            if (!_.isUndefined($scope.steps[index])) {
                $scope.selection = $scope.steps[index];
            }
        };

        $scope.hasNextStep = function() {
            var stepIndex = $scope.getCurrentStepIndex();
            var nextStep = stepIndex + 1;
            // Return true if there is a next step, false if not
            return !_.isUndefined($scope.steps[nextStep]);
        };

        $scope.hasPreviousStep = function() {
            var stepIndex = $scope.getCurrentStepIndex();
            var previousStep = stepIndex - 1;
            // Return true if there is a next step, false if not
            return !_.isUndefined($scope.steps[previousStep]);
        };

        $scope.incrementStep = function() {
            if ($scope.hasNextStep()) {
                var stepIndex = $scope.getCurrentStepIndex();
                var nextStep = stepIndex + 1;
                $scope.selection = $scope.steps[nextStep];
            }
        };

        $scope.decrementStep = function() {
            if ($scope.hasPreviousStep()) {
                var stepIndex = $scope.getCurrentStepIndex();
                var previousStep = stepIndex - 1;
                $scope.selection = $scope.steps[previousStep];
            }
        };

        dataFactory.getBookTypes()
            .success(function(data) {
                $scope.book_types = data;

            });


        $scope.addBook = function() {
            console.log('add called');
            $scope.book.authors = $scope.authors;
            $scope.book.publisher = $scope.publisher;
            $scope.book.tags = $scope.tags;
            dataFactory.insertBook($scope.book)
                .success(function() {
                    $scope.status = 'Your book is added successfully. we will get back to you soon';
                    $scope.statusCheck = true;
                    var message = '<strong> Book added!</strong> ';
                    var id = Flash.create('success', message, 3000, { class: 'custom-class', id: 'custom-id' }, true);
                    // $scope.book.push($scope.book);
                }).
            error(function(error) {
                $scope.status = 'Unable to insert Your: ' + error.message;
                $scope.statusCheck = false;
                var message = '<strong> Unable to add!</strong> ' + error.message;
                var id = Flash.create('warning', message, 10000, { class: 'custom-class', id: 'custom-id' }, true);
            });

            // $scope.book = {
            //     first_name: "",
            //     last_name: "",
            //     phone_number: "",
            //     email: "",
            //     address: "",
            //     previous_school: "",
            //     source: "",
            //     question: ""
            // };

            // $scope.bookForm.$setPristine();


            //Step 5: reset your JavaScript object that holds your comment
        };

    }
])


.controller('BookListController', ['$scope', 'dataFactory', 'Flash', '$uibModal',
    function($scope, dataFactory, Flash, $uibModal) {

        //These variables MUST be set as a minimum for the calendar to work
        var data = [{
                id: 1,
                title: 'Business Environment',
                subject: 'Business',
                isbn: '23RR',
                'publisher': 'Season',
                authors: ['kumar pandit', 'sagun bhandari'],
                edition: '5th',
                book_type: 'Lending',
                keywords: ['management', 'book']
            }, {
                id: 2,
                title: 'Financial Management',
                subject: 'Finance',
                isbn: '2333R',
                'publisher': 'Kshitiz',
                authors: ['kumar pandit', 'sagun bhandari'],
                edition: '5th',
                book_type: 'Reference',
                keywords: ['finance']
            }]
            // $scope.books = data;
        $scope.orderByField = 'title';
        $scope.reverseSort = false;
        $scope.books = [];
        $scope.sending = true;
        $scope.generated = false;
        $scope.generated_signal = false;
        dataFactory.getAllBooks()
            .success(function(data) {
                $scope.books = data;
                $scope.sending = false;
                $scope.books.forEach(function(book) {
                        
                        if(book.barcode){
                            $scope.generated = true;
                        }
                    });

            });
        $scope.generateBarcode = function() {
            $scope.generated_signal = true;
            dataFactory.createBarcode()

            .success(function() {

                dataFactory.getAllBooks()
                    .success(function(data) {
                        $scope.books = data;
                        $scope.generated = true;
                        $scope.generated_signal = false;
                        // scope.$apply();

                    });

                var message = '<strong> Barcode is generated!</strong> ';
                var id = Flash.create('success', message, 3000, { class: 'custom-class', id: 'custom-id' }, true);

                // $scope.book.push($scope.book);
            }).
            error(function(error) {
                $scope.status = 'Unable to delete: ' + error.message;
                $scope.statusCheck = false;
            });

        }
        $scope.printBarcode = function() {

            dataFactory.printBarcodes()

            .success(function(data) {

                console.log(data);

                // $scope.book.push($scope.book);
            }).
            error(function(error) {
                $scope.status = 'Unable to delete: ' + error.message;
                $scope.statusCheck = false;
            });

        }
        $scope.delete = function(book) {
            if (confirm('Are you sure you want to delete this?')) {

                dataFactory.deleteBook(book)

                .success(function() {

                    var message = '<strong> Book is deleted!</strong> ';
                    var id = Flash.create('warning', message, 3000, { class: 'custom-class', id: 'custom-id' }, true);
                    var index = $scope.books.indexOf(book);
                    $scope.books.splice(index, 1);

                    // $scope.book.push($scope.book);
                }).
                error(function(error) {
                    $scope.status = 'Unable to delete: ' + error.message;
                    $scope.statusCheck = false;
                });
            }

        };


        $scope.open = function(book) {

            var modalInstance = $uibModal.open({
                templateUrl: 'myModalContent.html',
                controller: 'ModalInstanceCtrl',
                resolve: {
                    book: function() {
                        return book;
                    }
                }
            });

            modalInstance.result.then(function() {
                // $scope.user.name = user.name;
            }, function() {
                // $log.info('Modal dismissed at: ' + new Date());
            });
        };

    }
])

.controller('ModalInstanceCtrl', function(
    $scope, dataFactory, $uibModalInstance, book) {
    $scope.book = book;


    $scope.steps = [
        'Step 1: Book Info',
        'Step 2: Publisher Info',
        'Step 3: Authors Info',
        'Step 4: Extra Info'
    ];
    $scope.selection = $scope.steps[0];

    $scope.getCurrentStepIndex = function() {
        // Get the index of the current step given selection
        return _.indexOf($scope.steps, $scope.selection);
    };

    // Go to a defined step index
    $scope.goToStep = function(index) {
        if (!_.isUndefined($scope.steps[index])) {
            $scope.selection = $scope.steps[index];
        }
    };

    $scope.hasNextStep = function() {
        var stepIndex = $scope.getCurrentStepIndex();
        var nextStep = stepIndex + 1;
        // Return true if there is a next step, false if not
        return !_.isUndefined($scope.steps[nextStep]);
    };

    $scope.hasPreviousStep = function() {
        var stepIndex = $scope.getCurrentStepIndex();
        var previousStep = stepIndex - 1;
        // Return true if there is a next step, false if not
        return !_.isUndefined($scope.steps[previousStep]);
    };

    $scope.incrementStep = function() {
        if ($scope.hasNextStep()) {
            var stepIndex = $scope.getCurrentStepIndex();
            var nextStep = stepIndex + 1;
            $scope.selection = $scope.steps[nextStep];
        }
    };

    $scope.decrementStep = function() {
        if ($scope.hasPreviousStep()) {
            var stepIndex = $scope.getCurrentStepIndex();
            var previousStep = stepIndex - 1;
            $scope.selection = $scope.steps[previousStep];
        }
    };
    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
    $scope.tags = [
        { text: 'just' },
        { text: 'some' },
        { text: 'cool' },
        { text: 'tags' }
    ];
    $scope.toggle = function($event, field, event) {
        $event.preventDefault();
        $event.stopPropagation();
        event[field] = !event[field];
    };

    $scope.addField = function() {
        $scope.book.authors.push({ name: '' })
    }

    $scope.removeField = function(index) {
        if (confirm('Are you sure you want to delete this?')) {
            // TODO:  Do something here if the answer is "Ok".
            $scope.book.authors.splice(index, 1);
        }
    }

    dataFactory.getBookTypes()
        .success(function(data) {
            $scope.book_types = data;

        });

    $scope.ok = function() {
        console.log('updated');
        console.log($scope.book);
        dataFactory.updateBook($scope.book)
            .success(function() {


                $uibModalInstance.close();
                // $scope.enquiry.push($scope.enquiry);
            }).
        error(function(error) {
            $scope.status = 'Unable to update: ' + error.message;
            $scope.statusCheck = true;
            $scope.statusClass = 'alert-error';
        });

    };

})


.controller('BookSearchController', ['$scope', 'dataFactory', '$uibModal', 'Flash',
    function($scope, dataFactory, $uibModal, Flash) {

        //These variables MUST be set as a minimum for the calendar to work
        $scope.query = '';
        $scope.sending = true;
        $scope.books = [];
        $scope.itemsPerPage = 10
        $scope.currentPage = 1;
        dataFactory.getAllBooks($scope.issuebook)
            .success(function(data) {
                // body...
                console.log(data);
                $scope.books = data;
                $scope.sending = false;
            }).
        error(function(error) {
            console.log(error);
        });

       


    }
])

.controller('BookIssueController', ['$scope', 'dataFactory', 'Flash', '$location', '$uibModal',
    function($scope, dataFactory, Flash, $location, $uibModal) {

        console.log('calleded called');

        var issue_url = $location.$$absUrl;
        var issue_array = issue_url.split('/');
        var student_string = issue_array[issue_array.length - 1]
        var student_string_array = student_string.split('=');
        var student_id = student_string_array[student_string_array.length - 1]
        $scope.student = {};
        $scope.student_found = false;
        $scope.books = [];
        $scope.issue = {};
        $scope.issuebook = {};
        $scope.renewbook = {};
        $scope.returnbook = {};
        $scope.idate = '';

        // var vm = this;
        console.log('initial book data');
        console.log($scope.books);
        $scope.valuationDate = new Date();
        $scope.valuationDatePickerIsOpen = false;
        $scope.opens = [];

        $scope.$watch(function() {
            return $scope.valuationDatePickerIsOpen;
        }, function(value) {
            $scope.opens.push("valuationDatePickerIsOpen: " + value + " at: " + new Date());
        });

        $scope.valuationDatePickerOpen = function($event) {

            if ($event) {
                $event.preventDefault();
                $event.stopPropagation(); // This is the magic
            }
            this.valuationDatePickerIsOpen = true;
        };

        dataFactory.getStudentByCardId(student_id)
            .success(function(data) {
                console.log('student is');
                console.log(data);
                $scope.student = data;
                $scope.student_found = true;
                dataFactory.getBookFine($scope.student.id)
                    .success(function(data) {
                        console.log('fine');
                        console.log(data);
                        if (data.fine) {
                            $scope.fine = true;
                        }
                        dataFactory.getBookBorrowByStudent($scope.student.id)
                            .success(function(data) {
                                console.log('book borrow');
                                console.log(data);
                                $scope.books = data;
                            }).
                        error(function(error) {

                            $scope.status = 'Unable to insert Your: ' + error.message;
                        });

                    }).
                error(function(error) {

                    $scope.status = 'Unable to insert Your: ' + error.message;
                });


            }).
        error(function(error) {
            $scope.student_found = false;
            $scope.status = 'Unable to insert Your: ' + error.message;
            $scope.statusCheck = false;
        });



        $scope.format_date = function(someDate) {

            var dd = someDate.getDate();
            var mm = someDate.getMonth() + 1;
            var y = someDate.getFullYear();

            var someFormattedDate = y + '-' + mm + '-' + dd;
            console.log(someFormattedDate);
            return someFormattedDate;

        }
        $scope.check_book = function(obj, list) {
            var i;
            for (i = 0; i < list.length; i++) {
                if (list[i].book.barcode === obj.barcode) {
                    return true;
                }
            }

            return false;
        }

        $scope.issue_book = function() {
            console.log('issue book is called');
            dataFactory.getBookByBarcode($scope.issue.barcode)
                .success(function(data) {
                    console.log('availability');
                    console.log(data.availability);
                    if(!data.availability){

                        var message = '<strong> Book is already borrowed!</strong> ';
                            var id = Flash.create('warning', message, 7000, { class: 'custom-class', id: 'custom-id' }, true);
                            return;

                    }
                    console.log(data);
                    if ($scope.books.length > 0) {
                        if ($scope.check_book(data, $scope.books)) {
                            var message = '<strong> Book is already borrowed!</strong> ';
                            var id = Flash.create('warning', message, 7000, { class: 'custom-class', id: 'custom-id' }, true);
                            return;
                        }
                    }
                    if (data.book_type === null) {
                        var message = '<strong> Book Type is not defined!. Please update book type first</strong> ';
                        var id = Flash.create('warning', message, 7000, { class: 'custom-class', id: 'custom-id' }, true);
                        return;
                    } else if (data.book_type.name === 'Reference') {
                        var message = '<strong> Book is reference type!</strong> ';
                        var id = Flash.create('warning', message, 7000, { class: 'custom-class', id: 'custom-id' }, true);
                        return;

                    }
                    var issueDate = new Date();
                    var dueDate = new Date();


                    $scope.issuebook.book = data.id;
                    $scope.issuebook.student = $scope.student.id;
                    $scope.issuebook.issue_date = $scope.format_date(issueDate);
                    if ($scope.issue.due_date) {
                        $scope.issuebook.due_date = $scope.format_date($scope.issue.due_date);
                    } else {
                        var numberOfDaysToAdd = 15;
                        if (data.book_type) {
                            console.log('book type')
                            if (data.book_type.days_amount) {

                                numberOfDaysToAdd = parseInt(data.book_type.days_amount)
                            }
                        }
                        dueDate.setDate(dueDate.getDate() + numberOfDaysToAdd);
                        $scope.issuebook.due_date = $scope.format_date(dueDate);
                    }

                    // $scope.issuebook.book = data.id;

                    dataFactory.issueBook($scope.issuebook)
                        .success(function(data) {
                            // body...
                            dataFactory.getBookBorrowByStudent($scope.student.id)
                                .success(function(data) {
                                    $scope.books = data;
                                    // scope.$apply();
                                }).
                            error(function(error) {

                                $scope.status = 'Unable to insert Your: ' + error.message;
                            });
                            var message = '<strong> Book is issued!</strong> ';
                            var id = Flash.create('success', message, 3000, { class: 'custom-class', id: 'custom-id' }, true);
                        }).
                    error(function(error) {
                        console.log(error);
                    });


                }

                ).
            error(function(error) {
                $scope.status = 'Unable to find barcode: ' + error.message;
                $scope.statusCheck = false;
                var message = '<strong> Book with the barcode not found!</strong> ';
                var id = Flash.create('warning', message, 7000, { class: 'custom-class', id: 'custom-id' }, true);
            });

        };

        $scope.renew_book = function(book) {
            var issueDate = new Date();
            $scope.renewbook.id = book.id;
            $scope.renewbook.book = book.book.id;
            $scope.renewbook.student = $scope.student.id;
            $scope.renewbook.issue_date = $scope.format_date(issueDate);
            $scope.renewbook.return_date = book.return_date;
            $scope.renewbook.late_fee = book.late_fee;

            if (confirm('Are you sure you want to renew this?')) {
                // TODO:  Do something here if the answer is "Ok".
                var dueDate = new Date();
                var numberOfDaysToAdd = 15;
                if (book.book.book_type) {
                    console.log('enered');
                    numberOfDaysToAdd = parseInt(book.book.book_type.days_amount)
                }
                dueDate.setDate(dueDate.getDate() + numberOfDaysToAdd);
                $scope.renewbook.due_date = $scope.format_date(dueDate);
                dataFactory.updateBookIssue($scope.renewbook)
                    .success(function() {

                        var message = '<strong> Book is renewed</strong> ';
                        var id = Flash.create('warning', message, 5000, { class: 'custom-class', id: 'custom-id' }, true);

                    }).
                error(function(error) {
                    $scope.status = 'Unable to update: ' + error.message;
                    $scope.statusCheck = true;
                    $scope.statusClass = 'alert-error';
                });
            }

        };
        $scope.return_book = function(book) {
            var issueDate = new Date();
            var returnDate = new Date()
            $scope.returnbook.id = book.id;
            $scope.returnbook.book = book.book.id;
            $scope.returnbook.student = $scope.student.id;
            $scope.returnbook.issue_date = $scope.format_date(issueDate);
            $scope.returnbook.return_date = $scope.format_date(returnDate);
            $scope.returnbook.late_fee = book.late_fee;

            if (confirm('Are you sure you want to return this?')) {
                // TODO:  Do something here if the answer is "Ok".
                var dueDate = new Date();
                console.log(book);
                var numberOfDaysToAdd = 15;
                if (book.book.book_type) {
                    console.log('enered');
                    numberOfDaysToAdd = parseInt(book.book.book_type.days_amount)
                }
                dueDate.setDate(dueDate.getDate() + numberOfDaysToAdd);
                $scope.returnbook.due_date = $scope.format_date(dueDate);
                dataFactory.returnBook($scope.returnbook)
                    .success(function() {

                        dataFactory.getBookBorrowByStudent($scope.student.id)
                            .success(function(data) {
                                $scope.books = data;
                                // scope.$apply();
                            }).
                        error(function(error) {

                            $scope.status = 'Unable to insert Your: ' + error.message;
                        });

                        var message = '<strong> Book is returned!</strong> ';
                        var id = Flash.create('warning', message, 5000, { class: 'custom-class', id: 'custom-id' }, true);


                    }).
                error(function(error) {
                    var message = '<strong>  Please, pay your fine!</strong> ';
                    var id = Flash.create('warning', message, 5000, { class: 'custom-class', id: 'custom-id' }, true);
                    $scope.status = 'Unable to update: ' + error.message;
                    $scope.statusCheck = true;
                    $scope.statusClass = 'alert-error';
                });
            }

        };

        $scope.pay_fine = function(book) {


            if (confirm('Are you sure you want to pay?')) {
                // TODO:  Do something here if the answer is "Ok".

                dataFactory.payBookFine($scope.student.id)
                    .success(function(data) {
                        if (!data.fine) {
                            $scope.fine = false;
                        }
                        dataFactory.getBookBorrowByStudent($scope.student.id)
                            .success(function(data) {
                                $scope.books = data;
                            }).
                        error(function(error) {

                            $scope.status = 'Unable to insert Your: ' + error.message;
                        });

                    }).
                error(function(error) {

                    $scope.status = 'Unable to insert Your: ' + error.message;
                });

            }

        };
        console.log('final book data');
        console.log($scope.books);

    }
])

.controller('BookReturnController', ['$scope', 'dataFactory', 'Flash', '$location', '$uibModal', '$window',
    function($scope, dataFactory, Flash, $location, $uibModal, $window) {

        $scope.barcode = {};
        $scope.book = {};


        $scope.return_books = function() {

            dataFactory.getBookIssuedByBarcode($scope.barcode.value)
                .success(function(data) {
                    $scope.book = data;


                    dataFactory.returnBook($scope.book)
                        .success(function() {

                            var message = '<strong> Book is returned!</strong> ';
                            var id = Flash.create('warning', message, 5000, { class: 'custom-class', id: 'custom-id' }, true);


                        }).
                    error(function(error) {
                        var message = '<strong> Please, pay your fine!</strong> ';
                        var id = Flash.create('warning', message, 5000, { class: 'custom-class', id: 'custom-id' }, true);
                        $window.location.href = '/admin/library/issue/?cid=' + error.reg_no;
                        $scope.status = 'Unable to update: ' + error.message;
                        $scope.statusCheck = true;
                        $scope.statusClass = 'alert-error';
                    });


                    // if(data.late_fee){
                    //   $window.location.href = '/admin/library/issue/';
                    // }





                }).
            error(function(error) {

                var message = '<strong> Book is not issued by any students!</strong> ';
                var id = Flash.create('warning', message, 5000, { class: 'custom-class', id: 'custom-id' }, true);
            });

        };


    }

])

;
