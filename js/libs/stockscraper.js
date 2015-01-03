function getBalanceSheet( quote )
{
	$("#balanceSheetTable").remove();
	$("#balanceHeader").remove();
	$("#bsSection").append("<p id='loading'>Fetching data, please be patient!</p>");
	var requestURL = 'https://query.yahooapis.com/v1/public/yql?q=SELECT%20*%20FROM%20yahoo.finance.balancesheet%20WHERE%20symbol=%27' + quote + '%27%20AND%20timeframe=%27annual%27&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback='

	console.log( requestURL );

	$.ajax(
    {
    	url: requestURL,
        type: 'GET',
        crossDomain: true,
        dataType: 'json',
        success: function ( json ) {
        	var sArray = json['query']['results']['balancesheet']['statement'];

        	if( typeof sArray != "undefined" )
       			genBalanceSheet( sArray );
       		else {
       			$("#bsSection").append("<p id='balanceSheetTable'>We're sorry, this quote does not appear to have any data.</p>");
       			$("#loading").remove();
       		}
        }
    });
}