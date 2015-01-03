var profitMarginArray = new Array();

function genRatios( statementArray ) {
	$("#loading").remove();
	var tableString = "";

	// Generate header
	tableString += '<h4 id="balanceHeader">Ratios for ' + quoteBS.value + '</h4>';

	tableString += '<table id="balanceSheetTable" class="table table-hover">' +
    					'<thead><tr>' +
    						'<th class="text-center"></th>' +
    						'<th></th>' +
    						'<th></th>' +
    						'<th class="text-right">' + statementArray[0]['period'] + '</th>' +
    						'<th class="text-right">' + statementArray[1]['period'] + '</th>' +
    						'<th class="text-right">' + statementArray[2]['period'] + '</th>' +
    					'</tr></thead><tbody>';

    // Generate header
    tableString += '<tr><td><b>Liquidity Ratios</b></td><td></td><td></td><td></td><td></td><td></td></tr>';

    // Generate current ratio
    tableString += '<tr>';
    tableString += '<td>&nbsp;&nbsp;&nbsp;Current Ratio</td>';
    tableString += '<td></td>';
    tableString += '<td></td>';
    tableString += '<td class="text-right">' + currentRatio( statementArray[0]['TotalCurrentAssets']['content'], statementArray[0]['TotalCurrentLiabilities']['content'] ) + '</td>';
    tableString += '<td class="text-right">' + currentRatio( statementArray[1]['TotalCurrentAssets']['content'], statementArray[1]['TotalCurrentLiabilities']['content'] ) + '</td>';
    tableString += '<td class="text-right">' + currentRatio( statementArray[2]['TotalCurrentAssets']['content'], statementArray[2]['TotalCurrentLiabilities']['content'] ) + '</td>';
    tableString += '</tr>';

    // Generate quick ratio
    tableString += '<tr>';
    tableString += '<td>&nbsp;&nbsp;&nbsp;Quick Ratio</td>';
    tableString += '<td></td>';
    tableString += '<td></td>';
    tableString += '<td class="text-right">' + quickRatio( statementArray[0]['CashAndCashEquivalents']['content'], statementArray[0]['ShortTermInvestments']['content'], statementArray[0]['NetReceivables']['content'], statementArray[0]['TotalCurrentLiabilities']['content'] ) + '</td>';
    tableString += '<td class="text-right">' + quickRatio( statementArray[1]['CashAndCashEquivalents']['content'], statementArray[1]['ShortTermInvestments']['content'], statementArray[1]['NetReceivables']['content'], statementArray[1]['TotalCurrentLiabilities']['content'] ) + '</td>';
    tableString += '<td class="text-right">' + quickRatio( statementArray[2]['CashAndCashEquivalents']['content'], statementArray[2]['ShortTermInvestments']['content'], statementArray[2]['NetReceivables']['content'], statementArray[2]['TotalCurrentLiabilities']['content'] ) + '</td>';
    tableString += '</tr>';

    // Another header
    tableString += '<tr><td><b>Leverage Ratios</b></td><td></td><td></td><td></td><td></td><td></td></tr>';

    // Generate debt-equity ratio
    tableString += '<tr>';
    tableString += '<td>&nbsp;&nbsp;&nbsp;LT Debt-Equity Ratio</td>';
    tableString += '<td></td>';
    tableString += '<td></td>';
    tableString += '<td class="text-right">' + debtEquityRatio( statementArray[0]['LongTermDebt']['content'], statementArray[0]['Short_CurrentLongTermDebt']['content'], statementArray[0]['TotalStockholderEquity']['content'] ) + '</td>';
    tableString += '<td class="text-right">' + debtEquityRatio( statementArray[1]['LongTermDebt']['content'], statementArray[1]['Short_CurrentLongTermDebt']['content'], statementArray[1]['TotalStockholderEquity']['content'] ) + '</td>';
    tableString += '<td class="text-right">' + debtEquityRatio( statementArray[2]['LongTermDebt']['content'], statementArray[2]['Short_CurrentLongTermDebt']['content'], statementArray[2]['TotalStockholderEquity']['content'] ) + '</td>';
    tableString += '</tr>';

    // Something something soccer ball pun about headers
    tableString += '<tr><td><b>Utilization Ratios</b></td><td></td><td></td><td></td><td></td><td></td></tr>';

    // Generate days-sales in inventory
    tableString += '<tr>';
    tableString += '<td>&nbsp;&nbsp;&nbsp;Days Sales in Inventory</td>';
    tableString += '<td></td>';
    tableString += '<td></td>';
    tableString += '<td class="text-right">' + daysSalesRatio( statementArray[0]['Inventory']['content'], savedInfo[0][1], statementArray[0]['period'], statementArray[1]['period'] ) + '</td>';
    tableString += '<td class="text-right">' + daysSalesRatio( statementArray[1]['Inventory']['content'], savedInfo[1][1], statementArray[0]['period'], statementArray[1]['period'] ) + '</td>';
    tableString += '<td class="text-right">' + daysSalesRatio( statementArray[2]['Inventory']['content'], savedInfo[2][1], statementArray[0]['period'], statementArray[1]['period'] ) + '</td>';
    tableString += '</tr>';

    // Generate days-sales outstanding
    tableString += '<tr>';
    tableString += '<td>&nbsp;&nbsp;&nbsp;Days Sales Outstanding</td>';
    tableString += '<td></td>';
    tableString += '<td></td>';
    tableString += '<td class="text-right">' + daysSalesOut( statementArray[0]['NetReceivables']['content'], savedInfo[0][0], statementArray[0]['period'], statementArray[1]['period'] ) + '</td>';
    tableString += '<td class="text-right">' + daysSalesOut( statementArray[1]['NetReceivables']['content'], savedInfo[1][0], statementArray[0]['period'], statementArray[1]['period'] ) + '</td>';
    tableString += '<td class="text-right">' + daysSalesOut( statementArray[2]['NetReceivables']['content'], savedInfo[2][0], statementArray[0]['period'], statementArray[1]['period'] ) + '</td>';
    tableString += '</tr>';

    // Last header
    tableString += '<tr><td><b>Profitability Ratios</b></td><td></td><td></td><td></td><td></td><td></td></tr>';

    profitMarginArray = [ parseInt(profitMargin( savedInfo[0][2], savedInfo[0][3] )), parseInt(profitMargin( savedInfo[1][2], savedInfo[1][3] )), parseInt(profitMargin( savedInfo[2][2], savedInfo[2][3] ))];

    // Generate Profit Margin
    tableString += '<tr ' + rowStyle( profitMarginArray ) + '>';
    tableString += '<td>&nbsp;&nbsp;&nbsp;Profit Margin</td>';
    tableString += '<td></td>';
    tableString += '<td></td>';
    tableString += '<td class="text-right">' + profitMargin( savedInfo[0][2], savedInfo[0][3] ) + '</td>';
    tableString += '<td class="text-right">' + profitMargin( savedInfo[1][2], savedInfo[1][3] ) + '</td>';
    tableString += '<td class="text-right">' + profitMargin( savedInfo[2][2], savedInfo[2][3] ) + '</td>';
    tableString += '</tr>';

    // Generate ROE
    tableString += '<tr>';
    tableString += '<td>&nbsp;&nbsp;&nbsp;Return on Equity</td>';
    tableString += '<td></td>';
    tableString += '<td></td>';
    tableString += '<td class="text-right">' + returnOnEquity( savedInfo[0][3], statementArray[0]['TotalStockholderEquity']['content'] ) + '</td>';
    tableString += '<td class="text-right">' + returnOnEquity( savedInfo[1][3], statementArray[1]['TotalStockholderEquity']['content'] ) + '</td>';
    tableString += '<td class="text-right">' + returnOnEquity( savedInfo[2][3], statementArray[2]['TotalStockholderEquity']['content'] ) + '</td>';
    tableString += '</tr>';

    // Generate ROA
    tableString += '<tr>';
    tableString += '<td>&nbsp;&nbsp;&nbsp;Return on Assets</td>';
    tableString += '<td></td>';
    tableString += '<td></td>';
    tableString += '<td class="text-right">' + returnOnAssets( savedInfo[0][2], statementArray[0]['TotalAssets']['content'] ) + '</td>';
    tableString += '<td class="text-right">' + returnOnAssets( savedInfo[1][2], statementArray[1]['TotalAssets']['content'] ) + '</td>';
    tableString += '<td class="text-right">' + returnOnAssets( savedInfo[2][2], statementArray[2]['TotalAssets']['content'] ) + '</td>';
    tableString += '</tr>';

    // ....annnnnd Fin :D
    tableString += '</tbody></table>';

    $("#raSection").append( tableString );
    $("#raSection").append( "<br />" + writeReport() );

}

// Calculator functions
function currentRatio( currAssets, currLiabilities )
{
	var ca = parseInt( currAssets );
	var cl = parseInt( currLiabilities );
	if( cl == 0 || ca * 1 != ca || cl * 1 != cl )
		return "-";
	else
		return ( ca / cl ).toFixed( 2 );
}

function quickRatio( cash, sti, receive, currLiabilities )
{
	var ca = 0;
	if( parseInt( cash ) * 1 == parseInt( cash ) )
		ca += parseInt( cash );
	if( parseInt( sti ) * 1 == parseInt( sti ) )
		ca += parseInt( sti );
	if( parseInt( receive ) * 1 == parseInt( receive ) )
		ca += parseInt( receive );
	
	var cl = parseInt( currLiabilities );
	if( cl == 0 || ca * 1 != ca || cl * 1 != cl )
		return "-";
	else
		return ( ca / cl ).toFixed( 2 );
}

function debtEquityRatio( ltdebt, stdebt, tsEquity )
{
	console.log( "-" );
	var de = 0;
	if( parseInt( ltdebt ) * 1 == parseInt( ltdebt ) )
		de += parseInt( ltdebt );
	if( parseInt( stdebt ) * 1 == parseInt( stdebt ) )
		de += parseInt( stdebt );

	var te = parseInt( tsEquity );

	if( te == 0 || de * 1 != de || te * 1 != te )
		return "-";
	else
		return ( de / te ).toFixed( 2 );
}

function daysSalesRatio( inventory, cogs, newPer, oldPer )
{
	var diffInMilliseconds = new Date( newPer ).getTime() - new Date( oldPer ).getTime();
	var daysInPer = diffInMilliseconds / 1000 / 60 / 60 / 24;

	var inv = parseInt( inventory );
	if( inv * 1 != inv || inv == 0 || cogs == 0 )
		return "-";
	else
		return Math.round( inv / ( cogs / daysInPer ));
}

function daysSalesOut( receive, sales, newPer, oldPer )
{
	var diffInMilliseconds = new Date( newPer ).getTime() - new Date( oldPer ).getTime();
	var daysInPer = diffInMilliseconds / 1000 / 60 / 60 / 24;

	var ar = parseInt( receive );
	if( ar * 1 != ar || ar == 0 || sales == 0 )
		return "-";
	else
		return Math.round( ar / ( sales / daysInPer ));
}

function returnOnEquity( netIncome, tsEquity )
{
	var ts = parseInt( tsEquity );

	if( ts * 1 != ts || ts == 0 )
		return "-";
	else
		return ( 100 * netIncome / ts ).toFixed( 2 ) + "%";
}

function returnOnAssets( EBIT, tAssets )
{
	var ta = parseInt( tAssets );

	if( ta * 1 != ta || ta == 0 )
		return "-";
	else
		return ( 100 * EBIT / ta ).toFixed( 2 ) + "%";
}

function profitMargin( sales, netIncome )
{
    return (( 100 * netIncome )/sales).toFixed( 2 ) + "%";
}

// Helper functions

function rowStyle( arr )
{
    if( increasingArray( arr ))
        return "class='success'";
    else if( decreasingArray( arr ))
        return "class='danger'";
    else
        return "";
}

function increasingArray( arr )
{
    return arr[0] > arr[1] && arr[1] > arr[2];
}

function decreasingArray( arr )
{
    return arr[0] < arr[1] && arr[1] < arr[2];
}

// Essay functions

function writeReport()
{
    var sigDiff = 5;
    var rpt = "<div id='analysis'><h4>Analysis\n</h4><p>";
    rpt += "<b>Profit Margin: </b>";
    rpt += "The profit margin has ";

    if( profitMarginArray[0] > profitMarginArray[1] )
        rpt += "increased ";
    else if( profitMarginArray[1] > profitMarginArray[0] )
        rpt += "decreased ";
    else
        rpt + "not changed significantly ";

    rpt += "in the last year";

    if( increasingArray( profitMarginArray ))
        rpt += ", and is part of an increasing trend. This is indicative of two possibilities: 1) expenses have fallen relative to sales, or 2) the business is selling products at a higher price without a corresponding increase in costs. Either way, this is good news!";
    else if( decreasingArray( profitMarginArray ))
        rpt += ", and is part of a decreasing trend. This is indicative of two possibilities: 1) costs are increasing, or 2) products are selling at a lower price than before. This is not good news.";
    else {
        if( Math.abs( profitMarginArray[0] - profitMarginArray[1] ) > sigDiff )
            rpt += ". This is a significant change from the prior year; it may be worth taking a closer look to see what caused this.";
        else
            rpt += ". This is not a significant change, and is not indicative of any major trend.";
    }

    rpt += "</p></div>";
    return rpt;
}