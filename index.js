
var months = [];
var collection = [];
var expenses = [];
const collectionTableBody = 'collection-table-body';
const expenseTableBody = 'expense-table-body';

$(document).ready(function () {
    init();
    $.getJSON("maintenance.json", function (data) {
        collection = data.collection;
        expenses = data.expenses;
        let totalCollection = populateTable(collection, collectionTableBody);
        let totalExpense = populateTable(expenses, expenseTableBody);
        updateHeader(totalCollection, totalExpense);

        var dropdown = $("#monthDropdown");
        months = Object.keys(collection);
        $.each(months, function (index, month) {
            dropdown.append($("<option></option>").attr("value", month).text(month));
        });
    });

});

function onMonthSelected() {
    $("#monthDropdown").change(() => {
        var selectedValue = event.target.value;
        if (!selectedValue) {
            let totalCollection = populateTable(collection, collectionTableBody);
            let totalExpense = populateTable(expenses, expenseTableBody);
            updateHeader(totalCollection, totalExpense);
        }
        else {
            let totalCollection = populateTable({ [selectedValue]: collection[selectedValue] }, collectionTableBody);
            let totalExpense = populateTable({ [selectedValue]: expenses[selectedValue] }, expenseTableBody);
            updateHeader(totalCollection, totalExpense);
        }
    });
}

function populateTable(data, tableId) {
    let rows = '';
    let totalAmount = 0;

    $.each(data, (key, record) => {
        rows += '<tr>';
        rows += `<td rowspan="${record?.length}">${key}</td>`
        $.each(record, (index, obj) => {
            rows += tableId.includes('collection') ? collectionRow(obj) : expenseRow(obj);
            totalAmount += obj.Amount;
        });
    });
    $("#" + tableId).html(rows);
    return totalAmount;
};

function collectionRow(obj) {
    return `<td>${obj.FlatId}</td>
					<td>${obj.Amount}</td>
					<td>${obj.PaymentDate}</td>
					<td class="${obj.Status == 'Paid' ? 'bg-success' : 'bg-warning'}">${obj.Status}</td></tr>`;
}

function expenseRow(obj) {
    return `<td>${obj.Category}</td>
                <td>${obj.Date}</td>
                <td>${obj.Amount}</td>
                <td>${obj.Description}</td></tr>`;
}

function init() {

    onMonthSelected();

    $('#expense-table').hide();
    $('#collection-btn').click(() => {
        $('#collection-btn').removeClass('text-dark').addClass('active bg-success text-light');
        $('#expense-btn').removeClass('active bg-danger text-light').addClass('text-dark');
        $('#collection-table').show();
        $('#expense-table').hide();
    });
    $('#expense-btn').click(() => {
        $('#expense-btn').removeClass('text-dark').addClass('active bg-danger text-light');
        $('#collection-btn').removeClass('active bg-success text-light').addClass('text-dark');
        $('#collection-table').hide();
        $('#expense-table').show();
    });
}

function updateHeader(totalCollection, totalExpense) {
    $('#totalCollectionLabel').text(totalCollection);
    $('#totalExpenseLabel').text(totalExpense);
    $('#totalBalanceLabel').text(totalCollection - totalExpense);
}