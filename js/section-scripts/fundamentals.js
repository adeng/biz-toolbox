var profitMarginArray = new Array();

function genRatios( statementArray ) {
	$("#loading").remove();
	var tableString = "";

	// Generate header
	tableString += '<h4 id="balanceHeader">Ratios for ' + quoteBS.value + '</h4>';
    $("#quoteBS").val("");

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
    tableString += '<td class="ratio-li">Current Ratio</td>';
    tableString += '<td></td>';
    tableString += '<td></td>';
    tableString += '<td class="text-right">' + currentRatio( statementArray[0]['TotalCurrentAssets']['content'], statementArray[0]['TotalCurrentLiabilities']['content'] ) + '</td>';
    tableString += '<td class="text-right">' + currentRatio( statementArray[1]['TotalCurrentAssets']['content'], statementArray[1]['TotalCurrentLiabilities']['content'] ) + '</td>';
    tableString += '<td class="text-right">' + currentRatio( statementArray[2]['TotalCurrentAssets']['content'], statementArray[2]['TotalCurrentLiabilities']['content'] ) + '</td>';
    tableString += '</tr>';

    // Generate quick ratio
    tableString += '<tr>';
    tableString += '<td class="ratio-li">Quick Ratio</td>';
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
    tableString += '<td class="ratio-li">LT Debt-Equity Ratio</td>';
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
    tableString += '<td class="ratio-li">Days Sales in Inventory</td>';
    tableString += '<td></td>';
    tableString += '<td></td>';
    tableString += '<td class="text-right">' + daysSalesRatio( statementArray[0]['Inventory']['content'], savedInfo[0][1], statementArray[0]['period'], statementArray[1]['period'] ) + '</td>';
    tableString += '<td class="text-right">' + daysSalesRatio( statementArray[1]['Inventory']['content'], savedInfo[1][1], statementArray[0]['period'], statementArray[1]['period'] ) + '</td>';
    tableString += '<td class="text-right">' + daysSalesRatio( statementArray[2]['Inventory']['content'], savedInfo[2][1], statementArray[0]['period'], statementArray[1]['period'] ) + '</td>';
    tableString += '</tr>';

    // Generate days-sales outstanding
    tableString += '<tr>';
    tableString += '<td class="ratio-li">Days Sales Outstanding</td>';
    tableString += '<td></td>';
    tableString += '<td></td>';
    tableString += '<td class="text-right">' + daysSalesOut( statementArray[0]['NetReceivables']['content'], savedInfo[0][0], statementArray[0]['period'], statementArray[1]['period'] ) + '</td>';
    tableString += '<td class="text-right">' + daysSalesOut( statementArray[1]['NetReceivables']['content'], savedInfo[1][0], statementArray[0]['period'], statementArray[1]['period'] ) + '</td>';
    tableString += '<td class="text-right">' + daysSalesOut( statementArray[2]['NetReceivables']['content'], savedInfo[2][0], statementArray[0]['period'], statementArray[1]['period'] ) + '</td>';
    tableString += '</tr>';

    // Last header
    tableString += '<tr><td><b>Profitability Ratios</b></td><td></td><td></td><td></td><td></td><td></td></tr>';

    profitMarginArray = [ parseInt(profitMargin( savedInfo[0][0], savedInfo[0][3] )), parseInt(profitMargin( savedInfo[1][0], savedInfo[1][3] )), parseInt(profitMargin( savedInfo[2][0], savedInfo[2][3] ))];

    // Generate Profit Margin
    tableString += '<tr ' + rowStyle( profitMarginArray ) + '>';
    tableString += '<td class="ratio-li">Profit Margin</td>';
    tableString += '<td></td>';
    tableString += '<td></td>';
    tableString += '<td class="text-right">' + profitMargin( savedInfo[0][0], savedInfo[0][3] ) + '</td>';
    tableString += '<td class="text-right">' + profitMargin( savedInfo[1][0], savedInfo[1][3] ) + '</td>';
    tableString += '<td class="text-right">' + profitMargin( savedInfo[2][0], savedInfo[2][3] ) + '</td>';
    tableString += '</tr>';

    grossProfitArray = [ parseInt( grossProfit( savedInfo[0][0], savedInfo[0][1] )), parseInt( grossProfit( savedInfo[1][0], savedInfo[1][1] )), parseInt( grossProfit( savedInfo[2][0], savedInfo[2][1] ))];

    // Generate Gross Profit Margin
    tableString += '<tr ' + rowStyle( grossProfitArray ) + '>';
    tableString += '<td class="ratio-li">Gross Profit Percentage</td>';
    tableString += '<td></td>';
    tableString += '<td></td>';
    tableString += '<td class="text-right">' + grossProfit( savedInfo[0][0], savedInfo[0][1] ) + '</td>';
    tableString += '<td class="text-right">' + grossProfit( savedInfo[1][0], savedInfo[1][1] ) + '</td>';
    tableString += '<td class="text-right">' + grossProfit( savedInfo[2][0], savedInfo[2][1] ) + '</td>';
    tableString += '</tr>';

    returnAssetsArray = [ parseInt( returnOnAssets( savedInfo[0][2], statementArray[0]['TotalAssets']['content'] )), parseInt( returnOnAssets( savedInfo[1][2], statementArray[1]['TotalAssets']['content'] )), parseInt( returnOnAssets( savedInfo[2][2], statementArray[2]['TotalAssets']['content'] )) ];

    // Generate ROA
    tableString += '<tr ' + rowStyle( returnAssetsArray ) + '>';
    tableString += '<td class="ratio-li">Return on Assets</td>';
    tableString += '<td></td>';
    tableString += '<td></td>';
    tableString += '<td id="roaCurrPer" class="text-right">' + returnOnAssets( savedInfo[0][2], statementArray[0]['TotalAssets']['content'] ) + '</td>';
    tableString += '<td class="text-right">' + returnOnAssets( savedInfo[1][2], statementArray[1]['TotalAssets']['content'] ) + '</td>';
    tableString += '<td class="text-right">' + returnOnAssets( savedInfo[2][2], statementArray[2]['TotalAssets']['content'] ) + '</td>';
    tableString += '</tr>';

    // Generate ROE
    tableString += '<tr>';
    tableString += '<td class="ratio-li">Return on Equity</td>';
    tableString += '<td></td>';
    tableString += '<td></td>';
    tableString += '<td class="text-right">' + returnOnEquity( savedInfo[0][3], statementArray[0]['TotalStockholderEquity']['content'] ) + '</td>';
    tableString += '<td class="text-right">' + returnOnEquity( savedInfo[1][3], statementArray[1]['TotalStockholderEquity']['content'] ) + '</td>';
    tableString += '<td class="text-right">' + returnOnEquity( savedInfo[2][3], statementArray[2]['TotalStockholderEquity']['content'] ) + '</td>';
    tableString += '</tr>';

    // ....annnnnd Fin :D
    tableString += '</tbody></table>';

    $("#raSection").append( tableString );
    $("#raSection").append( writeReport() );

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

function grossProfit( sales, cogs )
{
    return (100 * ( sales - cogs )/sales ).toFixed( 2 ) + "%";
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
    var sigDiff = 3;
    var rpt = "<div id='analysis'><h4>Analysis</h4><p>";

    // Profit Margin
    rpt += "<b>Profit Margin: </b>The profit margin is the percentage of sales revenue that ends up as profit; a higher number is better! ";
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

    rpt += "</p><br /><p>"

    // Gross Profit Percentage
    rpt += "<b>Gross Profit Percentage: </b>The gross profit percentage is the percent of profit remaining after paying for the costs of production. The lower the percentage, the more expensive the cost of revenues are relative to revenues. ";
    rpt += "The gross profit percentage has ";

    if( grossProfitArray[0] > grossProfitArray[1] )
        rpt += "increased ";
    else if( grossProfitArray[1] > grossProfitArray[0] )
        rpt += "decreased ";
    else
        rpt += "not changed significantly ";

    rpt += "in the last year";

    if( increasingArray( grossProfitArray ))
        rpt += ", and is part of an increasing trend. This means that either prices are rising and/or costs are falling. Consider the company's market share and influence on its suppliers, or demand for the product.";
    else if( decreasingArray( grossProfitArray ))
        rpt += ", and is part of a decreasing trend. This means that prices are falling and/or costs are rising. Consider inflation or the company's relative market share and influence on suppliers.";
    else {
        if( Math.abs( grossProfitArray[0] - grossProfitArray[1] ) > sigDiff )
            rpt += ". This is a significant change from the prior year; check the news to see if anything has changed in the last year.";
        else
            rpt += ". This is not a significant change, and is not indicative of any major trend.";
    }

    rpt += "</p><br /><p>"

    // Return on Assets

    rpt += "<b>Return on Assets: </b>This is the return generated by the company's assets. This ratio is useful for determining how effective management is at using funding from creditors or shareholders to turn a profit. As usual, a higher percentage indicates a stronger company. For our purposes, this program calculates the ratio using EBIT.";
    rpt += "</p><p>This company's return on assets for the prior period is " + $("#roaCurrPer").text() + ". This means that for every dollar in assets the company holds, the company generates approximately " + returnAssetsArray[0] + " cents in return. ";
    rpt += "In the past year, the company's return on assets has ";

    if( returnAssetsArray[0] - returnAssetsArray[1] >= sigDiff )
        rpt += "increased significantly, indicating that the company has become significantly more efficient in using its resources. It is worth investigating this change. Some possibilities include a reduction in expenses or an increase in revenues, all while holding assets constant. It is also possible that the company is 'consuming' its assets without replenishing them, which is not as beneficial to the company's health. ";
    else if ( returnAssetsArray[0] - returnAssetsArray[1] =< -1 * sigDiff )
        rpt += "decreased significantly, indicating that something has affected the company's efficiency in using its assets. It is possible that the company has recently increased its assets without a corresponding increase in profitability; perhaps it hasn't had time to make use of its acquisition. The less cheery possibility also exists, that the company isn't using its assets as effectively as it once did, perhaps due to competitive pressure, bad strategy, or an economic downturn. ";
    else
        rpt += "not changed drastically. Depending on the industry average, this company may be a good investment or not. ";

    rpt += "</p><p>Do note that since this application uses EBIT and not EBITDA to calculate RoA, it is possible that the company is taking creative liberties with its depreciation accounting policies to influence this ratio.";
    rpt += "</p></div>";
    return rpt;
}