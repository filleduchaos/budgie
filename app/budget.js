class Budget {
	constructor(month, year) {
		this.month = month;
		this.year = year;
		this.days = this.setDays();
		this.income = {
			monthly: {},
			weekly: {},
			daily: {},
			single: {},
			repeat: {}
		};
		this.expense = {
			monthly: {},
			weekly: {},
			daily: {},
			single: {},
			repeat: {}
		};
	}

	setDays() {
		switch (this.month) {
			case 'January':
			case 'March':
			case 'May':
			case 'July':
			case 'August':
			case 'October':
			case 'December':
				return 31;

			case 'April':
			case 'June':
			case 'September':
			case 'November':
				return 30;

			case 'February':
				if (this.year % 4 === 0) {
					return 29;
				} else {
					return 28;
				}

			default:
				return 0;
		}
	}

	getIncome(category, label) {
		return this.income[category][label];
	}

	setIncome(category, label, income, repeat) {
		if (repeat) {
			this.income.repeat[label] = [income, repeat];
		} else {
			this.income[category][label] = income;
		}
	}

	removeIncome(category, label) {
		Reflect.deleteProperty(this.income[category], label);
	}

	getExpense(category, label) {
		return this.expense[category][label];
	}

	setExpense(category, label, expense, repeat) {
		if (repeat) {
			this.expense.repeat[label] = [expense, repeat];
		} else {
			this.expense[category][label] = expense;
		}
	}

	removeExpense(category, label) {
		Reflect.deleteProperty(this.expense[category], label);
	}
}

module.exports = Budget;