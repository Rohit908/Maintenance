const collectionTableBody = '#collection-table-body';
const expenseTableBody = '#expense-table-body';
let collection = {};
let expenses = {};

$(document).ready(() => {
    init();

    $.getJSON("maintenance.json", (data) => {
        collection = data.collection;
        expenses = data.expenses;

        updateUI();

        const dropdown = $("#monthDropdown");
        Object.keys(collection).forEach(month => {
            dropdown.append(new Option(month, month));
        });

        dropdown.change(onMonthSelected);
    });
});

function onMonthSelected() {
    const selectedMonth = $("#monthDropdown").val();
    updateUI(selectedMonth);
}

function updateUI(month = null) {
    const filteredCollection = month ? { [month]: collection[month] } : collection;
    const filteredExpenses = month ? { [month]: expenses[month] } : expenses;

    const totalCollection = populateTable(filteredCollection, collectionTableBody, collectionRow);
    const totalExpense = populateTable(filteredExpenses, expenseTableBody, expenseRow);

    updateHeader(totalCollection, totalExpense);
    calculateBalance();
    $('#col').text(month);
    $('#exp').text(month);
}

function populateTable(data, tableId, rowFormatter) {
    let rows = '';
    let totalAmount = 0;

    $.each(data, (month, records) => {
        if (records?.length) {
            rows += `<tr><td rowspan="${records.length}">${month}</td>`;
            records.forEach((record, index) => {
                if (index > 0) rows += '<tr>';
                rows += rowFormatter(record);
                totalAmount += record.Amount;
            });
        }
    });

    $(tableId).html(rows);
    return totalAmount;
}

const collectionRow = (obj) => `
    <td>${obj.FlatId ? obj.FlatId : '-'}</td>
    <td>${obj.Amount ? obj.Amount : '-'}</td>
    <td>${obj.PaymentDate ? obj.PaymentDate : '-'}</td>
    <td class="${obj.Status === 'Paid' ? 'bg-success' : 'bg-warning'}">${obj.Status ? obj.Status : '-'}</td></tr>`;

const expenseRow = (obj) => `
    <td>${obj.Category ? obj.Category : '-' }</td>
    <td>${obj.Date ? obj.Date : '-' }</td>
    <td>${obj.Amount ? obj.Amount : '-' }</td>
    <td>${obj.Description ? obj.Description : '-' }</td></tr>`;

function init() {
    $('#expense-table').hide();

    $('#collection-btn, #expense-btn').click(function () {
        const isCollection = $(this).attr('id') === 'collection-btn';
        $('#collection-btn').toggleClass('active bg-success', isCollection);
        $('#expense-btn').toggleClass('active bg-danger', !isCollection);
        $('#collection-table').toggle(isCollection);
        $('#expense-table').toggle(!isCollection);
    });
}

function updateHeader(totalCollection, totalExpense) {
    $('#totalCollectionLabel').text(totalCollection);
    $('#totalExpenseLabel').text(totalExpense);
}

function calculateBalance(){
    const selectedMonth = $("#monthDropdown").val();

        let totalCollectionTillDate = 0;
        let totalExpenseTillDate = 0;
        for(const month in collection){
            if(new Date(month) > new Date(selectedMonth)){
                break;
            }
            totalCollectionTillDate += $.map(collection[month], item => item.Amount)
            .reduce((a, b) => a + b, 0);
            totalExpenseTillDate += $.map(expenses[month], item => item.Amount)
            .reduce((a, b) => a + b, 0);
        }
       
        $('#totalBalanceLabel').text(totalCollectionTillDate - totalExpenseTillDate);
}
