/*
 * Request: 0 - Display
 * Request: 1 - Ratios
 */

function getBalanceSheet( quote, request, section )
{
	$("#balanceSheetTable").remove();
	$("#balanceHeader").remove();
	$("#" + section + "Section").append("<p id='loading'>Fetching data, please be patient!</p>");
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
        	{
        		if( request == 0 )
       				genBalanceSheet( sArray );
       			if( request == 1 ) 
       			{
       				getIncomeStatement( quote, 2 );
       				genRatios( sArray );
       			}
        	}
       		else {
       			$("#" + section + "Section" ).append("<p id='balanceSheetTable'>We're sorry, this quote does not appear to have any data.</p>");
       			$("#loading").remove();
       		}
        }
    });
}

/*
 * Request: 0 - Display
 * Request: 1 - Ratios
 * Request: 2 - array( [ Sales, COGS, EBITDA or Pre-Tax Income + Interest Expense, Net Income ], <y2>, <y3> )
 *
 */
var savedInfo;

function getIncomeStatement( quote, request, section )
{
	$("#incomeStatementTable").remove();
	$("#incomeHeader").remove();
	$("#" + section + "Section").append("<p id='loading'>Fetching data, please be patient!</p>");
	var requestURL = 'https://query.yahooapis.com/v1/public/yql?q=SELECT%20*%20FROM%20yahoo.finance.incomestatement%20WHERE%20symbol%3D%27' + quote + '%27%20AND%20timeframe%3D%27annual%27&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=';

	console.log( requestURL );

	$.ajax(
    {
    	url: requestURL,
        type: 'GET',
        crossDomain: true,
        dataType: 'json',
        async: false,
        success: function ( json ) {
        	var sArray = json['query']['results']['incomestatement']['statement'];
        	console.log( sArray );
        	if( typeof sArray != "undefined" ) 
        	{
        		if( request == 0 )
        			genIncomeStatement( sArray );
        		if( parseInt( request ) == 2 ) {
        			savedInfo = [[ parseInt( sArray[0]['TotalRevenue']['content'] ), parseInt( sArray[0]['CostofRevenue']['content'] ), parseInt( sArray[0]['EarningsBeforeInterestAndTaxes']['content'] ), parseInt( sArray[0]['NetIncomeFromContinuingOps']['content'] ) ], [ parseInt( sArray[1]['TotalRevenue']['content'] ), parseInt( sArray[1]['CostofRevenue']['content'] ), parseInt( sArray[1]['EarningsBeforeInterestAndTaxes']['content'] ), parseInt( sArray[1]['NetIncomeFromContinuingOps']['content'] ) ], [ parseInt( sArray[2]['TotalRevenue']['content'] ), parseInt( sArray[2]['CostofRevenue']['content'] ), parseInt( sArray[2]['EarningsBeforeInterestAndTaxes']['content'] ), parseInt( sArray[2]['NetIncomeFromContinuingOps']['content'] ) ]];
        		}
        	}
       		else {
       			$("#" + section + "Section" ).append("<p id='balanceSheetTable'>We're sorry, this quote does not appear to have any data.</p>");
       			$("#loading").remove();
       		}
        }
    });
}