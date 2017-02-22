class Budget {
	constructor(data) {
		this.owner = data.owner;
		this.month = data.month;
		this.year = data.year;
		this.income = data.income || {};
		this.expense = data.expense || {};
	}

	getIncome(item) {
		return this.income[item];
	}

	addIncome(item, income, repeat) {
		this.income[item] = {};
		this.setProposedIncome(item, income);
		this.setRepeatIncome(item, repeat);
	}

	setProposedIncome(item, income) {
		this.income[item]['proposed'] = income;
	}

	setActualIncome(item, income) {
		this.income[item]['actual'] = income;
	}

	setRepeatIncome(item, repeat) {
		this.income[item]['repeat'] = repeat;
	}

	removeIncome(item) {
		Reflect.deleteProperty(this.income, item);
	}

	getExpense(item) {
		return this.expense[item];
	}

	addExpense(item, expense, repeat, priority) {
		this.expense[item] = {};
		this.setProposedExpense(item, expense);
		this.setRepeatExpense(item, repeat);
		this.setExpensePriority(item, priority);
	}

	setProposedExpense(item, expense) {
		this.expense[item]['proposed'] = expense;
	}

	setActualExpense(item, expense) {
		this.expense[item]['actual'] = expense;
	}

	setRepeatExpense(item, repeat) {
		this.expense[item]['repeat'] = repeat;
	}

	setExpensePriority(item, priority) {
		this.expense[item]['priority'] = priority;
	}

	removeExpense(item) {
		Reflect.deleteProperty(this.expense, item);
	}

	/* ------------------ ANALYSIS METHODS ------------------ */
	analyse() {
		this.calculateTotals();
		this.calculateVariances();
	}

	calculateTotals() {
		this.income['Total'] = {};
		this.expense['Total'] = {};

		var proposedIncome = [];
		var actualIncome = [];
		var proposedExpense = [];
		var actualExpense = [];
		for (var item in this.income) {
			if (item !== 'Total') {
				proposedIncome.push(this.income[item]['proposed']);
				actualIncome.push(this.income[item]['actual']);
			}
		}
		for (var item in this.expense) {
			if (item !== 'Total') {
				proposedExpense.push(this.expense[item]['proposed']);
				actualExpense.push(this.expense[item]['actual']);
			}
		}
		this.income['Total']['proposed'] = proposedIncome.reduce((total, num) => {
			return total + num;
		});
		this.income['Total']['actual'] = actualIncome.reduce((total, num) => {
			return total + num;
		});
		this.expense['Total']['proposed'] = proposedExpense.reduce((total, num) => {
			return total + num;
		});
		this.expense['Total']['actual'] = actualExpense.reduce((total, num) => {
			return total + num;
		});
	}

	calculateVariances() {
		for (var item in this.income) {
			this.calculateIncomeVariance(item);
		}
		for (var item in this.expense) {
			this.calculateExpenseVariance(item);
		}
	}

	calculateIncomeVariance(item) {
		let proposed = this.income[item]['proposed'];
		let actual = this.income[item]['actual'];
		this.income[item]['variance'] = actual - proposed;
		this.income[item]['varcent'] = Math.round(10000 * (actual - proposed) / proposed) / 100;
	}

	calculateExpenseVariance(item) {
		let proposed = this.expense[item]['proposed'];
		let actual = this.expense[item]['actual'];
		this.expense[item]['variance'] = proposed - actual;
		this.expense[item]['varcent'] = Math.round(10000 * (proposed - actual) / proposed) / 100;
	}

	static proposeBudget(budgets, owner, month, year) {
		var budget = new Budget({owner: owner, month: month, year: year});

		for (var i = 0; i < budgets.length; i++) {
			for (var item in budgets[i].income) {
				if (budgets[i].income[item]['repeat']) {
					let proposed = budgets[i].income[item]['actual'];
					if (item in budget.income) {
						budget.income[item]['proposed'].push(proposed);
					} else {
						budget.income[item] = {};
						budget.income[item]['proposed'] = [proposed];
					}
				}
			}

			for (var item in budgets[i].expense) {
				if (budgets[i].expense[item]['repeat']) {
					let proposed = budgets[i].expense[item]['actual'];
					let priority = budgets[i].expense[item]['priority'];
					if (item in budget.expense) {
						budget.expense[item]['proposed'].push(proposed);
					} else {
						budget.expense[item] = {};
						budget.expense[item]['proposed'] = [proposed];
					}
					budget.expense[item]['priority'] = priority;
				}
			}
		}

		for (var item in budget.income) {
			budget.income[item]['proposed'] = Math.round(100 * (budget.income[item]['proposed'].reduce((total, num) => {
				return total + num;
			}) / budget.income[item]['proposed'].length)) / 100;
			budget.income[item]['repeat'] = true;
		}

		for (var item in budget.expense) {
			budget.expense[item]['proposed'] = Math.round(100 * (budget.expense[item]['proposed'].reduce((total, num) => {
				return total + num;
			}) / budget.expense[item]['proposed'].length)) / 100;
			budget.expense[item]['repeat'] = true;
		}

		budget.calculateTotals();
		return budget;
	}
}