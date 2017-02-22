$(document).ready(function(){
	// the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
	$('.modal').modal();
	$('select').material_select();
	$(".dropdown-button").dropdown();
	$('ul.tabs').tabs();
});

var app = angular.module('myApp', []);

app.controller('myCtrl', ($scope, $http) => {
	$scope.displayName = '';
	$scope.uid = '';
	$scope.isCurrentBudgetSet = false;
	$scope.hasHistory = false;
	$scope.hasSelectedBudget = false;

	function init() {
		$http({
			method: 'GET',
			url: '/getprofile'
		}).success((data, status) => {
			console.log(data);
			$scope.displayName = data.displayName;
			$scope.uid = data.uid;
			$scope.currentMonth = getCurrentMonth();
			$scope.currentYear = new Date().getFullYear();
			$scope.getBudget($scope.currentMonth, $scope.currentYear, (budgetdata) => {
				if (budgetdata) {
					$scope.isCurrentBudgetSet = true;
					$scope.currentBudget = new Budget(budgetdata);
					$scope.currentBudget.analyse();
				} else {
					$scope.currentBudget = new Budget({
						owner: $scope.uid,
						month: $scope.currentMonth,
						year: $scope.currentYear
					})
				}
			});
			$scope.getAllBudgets((data) => {
				if (data) {
					$scope.hasHistory = true;
					$scope.allBudgets = data;
				}
			})
		});
	}

	$scope.setSelectedBudget = (month, year) => {
		$scope.getBudget(month, year, (budgetdata) => {
			$scope.selectedBudget = new Budget(budgetdata);
			$scope.selectedBudget.analyse();
		})
	}

	$scope.proposeCurrentBudget = () => {
		$scope.getBudgets((data) => {
			var budgets = [];
			for (var year in data) {
				for (var month in data[year]) {
					budgets.push(new Budget(data[year][month]));
				}
			}
			$scope.currentBudget = Budget.proposeBudget(budgets, $scope.uid, $scope.currentMonth, $scope.currentYear);
			$scope.saveCurrentBudget();
		})
	}

	$scope.getBudget = (month, year, callback) => {
		$http({
			method: 'POST',
			url: '/getbudget',
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			data: {
				owner: $scope.uid,
				month: month,
				year: year
			}
		}).success((data, status) => {
			console.log(data);
			callback(data);
		});
	}

	$scope.getBudgets = (callback) => {
		$http({
			method: 'POST',
			url: '/getbudgets',
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			data: {
				owner: $scope.uid
			}
		}).success((data, status) => {
			console.log(data);
			callback(data);
		});
	}

	$scope.getAllBudgets = (callback) => {
		$http({
			method: 'POST',
			url: '/getallbudgets',
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			data: {
				owner: $scope.uid
			}
		}).success((data, status) => {
			console.log(data);
			callback(data);
		});
	}

	$scope.saveCurrentBudget = () => {
		$scope.currentBudget.analyse();
		$scope.saveBudget($scope.currentBudget);
		$scope.isCurrentBudgetSet = true;
	}

	$scope.saveBudget = (budget) => {
		$http({
			method: 'POST',
			url: '/savebudget',
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			data: {
				owner: $scope.uid,
				month: budget.month,
				year: budget.year,
				income: budget.income,
				expense: budget.expense
			}
		}).success((data, status) => {
			console.log(status);
		});
	}

	function getCurrentMonth() {
		month = new Date().getMonth();

		switch (month) {
			case 0:
				return 'January';

			case 1:
				return 'February';

			case 2:
				return 'March';

			case 3:
				return 'April';

			case 4:
				return 'May';

			case 5:
				return 'June';

			case 6:
				return 'July';

			case 7:
				return 'August';

			case 8:
				return 'September';

			case 9:
				return 'October';

			case 10:
				return 'November';

			case 11:
				return 'December';

			default:
		}

	}

	init();
});