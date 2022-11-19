if (location.hostname.match(/^redmine./)) {
    console.log('%c RedmineDeadlineColors enabled', 'color: blue');
} else {
    console.log('%c RedmineDeadlineColors disabled on ' + location.hostname, 'color: red');
}
workingDaysBetween = function (fromDate, toDate) {
    if (!fromDate || isNaN(fromDate) || !toDate || isNaN(toDate) || toDate < fromDate) { return -1; }
    const fromDateCopy = new Date(fromDate.getTime()), toDateCopy = new Date(toDate.getTime());
    let numOfWorkingDays = 0;

    fromDateCopy.setHours(0, 0, 0, 0);
    toDateCopy.setHours(0, 0, 0, 0);

    while (fromDateCopy < toDateCopy) {
        fromDateCopy.setDate(fromDateCopy.getDate() + 1);
        var day = fromDateCopy.getDay();
        if (day != 0 && day != 6) { numOfWorkingDays++; }
    }
    return numOfWorkingDays;
};
const current_date_ms = new Date().setUTCHours(0, 0, 0, 0);
document.querySelectorAll('.issues > tbody > tr').forEach(function (row) {
    const due_date_td = row.querySelector('.due_date');
    const due_date = due_date_td.innerText;
    if (due_date.length == 10) {
        const due_date_ms = new Date(due_date).setUTCHours(0, 0, 0, 0);
        // termin
        if (due_date_ms < current_date_ms) {
            due_date_td.style.color = '#ff0000';
            // priorytet
            if (row.querySelector('.priority').innerText == 'Pilny') {
                row.querySelector('.priority').style.color = '#ff0000';
            }
            // przypisany do
            if (row.querySelector('.assigned_to').innerText == '') {
                row.querySelector('.assigned_to').innerText = '-- brak --';
                row.querySelector('.assigned_to').style.color = '#ff0000';
            }
            // ile dni po terminie
            const after_due_date = workingDaysBetween(new Date(due_date), new Date());
            if (after_due_date == 1) {
                due_date_td.innerText = due_date_td.innerText + "\t(" + after_due_date + ' dzień)';
            } else if (after_due_date > 1) {
                due_date_td.innerText = due_date_td.innerText + "\t(" + after_due_date + ' dni)';
            }
        } else if (due_date_ms == current_date_ms) {
            due_date_td.style.color = '#000000';
            due_date_td.style.fontWeight = 'bold';
        }
    }
});
