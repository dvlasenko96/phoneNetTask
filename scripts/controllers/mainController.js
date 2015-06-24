'use strict';

angular.module("myApp.controllers.Main", [])
	.controller("MainCtrl",
		function($scope, $firebaseArray) {
            // Подключение к firebase
			$scope.contacts = $firebaseArray(new Firebase("https://phonenet.firebaseio.com/users"));

            // Отправка формы создания/редактирования
			$scope.sendForm = function() {

                // Проверяем обязательные поля. Если форма не валидна, то выходим из функции
				if ($scope.contactForm.$invalid) {
					return false;
				};

                // Проверяем на существование контакта для редактирования.
                if($scope.editContact) {

                    // Находим нужный нам объект из массива
                    $scope.contacts.map(function(el, index) {
                        if(el.$id === $scope.editContact.$id) {
                            $scope.contacts[index].surname = ($scope.newContact.surname || ' ');
                            $scope.contacts[index].email = ($scope.newContact.email || ' ');

                            $scope.contacts.$save($scope.contacts[index])
                                .then(function() {
                                    // Очищаем объект редактирования, и новый объект
                                    $scope.newContact = {};
                                    $scope.editContact = {};
                                });
                        }
                    })
                } else {
                // Если контакта для редактирования нет, то добавляем его в базу
				$scope.contacts.$add($scope.newContact)
					.then(function() {
						$scope.newContact = {};
					});
                }
			}

            // Удаление элемента из Firebase
			$scope.removeItem = function(contact) {
				$scope.contacts.$remove(contact);
			}

            // Проверка на существование данного контакта. Проверяется совпадение имени и фамилии
			$scope.checkContact = function() {
				$scope.editContact = '';
				$scope.contacts.map(function(el) {
					if ((el.name === $scope.newContact.name) && (el.phone === $scope.newContact.phone)) {
						$scope.editContact = el;
					}
				});
			}
		});
