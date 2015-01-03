function genBalanceSheet( statementArray ) {
	$("#loading").remove();
	var tableString = "";
	var current = false;
	// Generate header
	tableString += '<h4 id="balanceHeader">Balance Sheet for ' + quote.value + '</h4>';

	tableString += '<table id="balanceSheetTable" class="table table-hover">' +
    					'<thead><tr>' +
    						'<th class="text-center">Asset</th>' +
    						'<th></th>' +
    						'<th></th>' +
    						'<th class="text-right">' + statementArray[0]['period'] + '</th>' +
    						'<th class="text-right">' + statementArray[1]['period'] + '</th>' +
    						'<th class="text-right">' + statementArray[2]['period'] + '</th>' +
    					'</tr></thead><tbody>';

    // Generate rest

    tableString += '<tr><td><b>Assets</b></td><td></td><td></td><td></td><td></td><td></td></tr>';
    tableString += '<tr><td><b>&nbsp;&nbsp;&nbsp;Current Assets</b></td><td></td><td></td><td></td><td></td><td></td></tr>';
    current = true;

   	for( var i = 0; i < Object.keys( statementArray[0] ).length; i++ )
	{
		var asset = Object.keys( statementArray[0] )[i];
		var display = asset;
		if( asset == "period" )
			continue;

		tableString += '<tr>';
		tableString += '<td>&nbsp;&nbsp;&nbsp;';

		if( asset.indexOf( "TotalCurrent" ) != -1 ) 
			current = false;

		if( current )
			tableString += '&nbsp;&nbsp;&nbsp;';

		if( asset.indexOf( "Total" ) != -1 )
			tableString += "<b>&nbsp;&nbsp;&nbsp;";

		if( asset == "PropertyPlantandEquipment" )
			tableString += "Property, Plant, and Equipment";
		else if( asset == "Short_CurrentLongTermDebt" ) 
			tableString += "Short-Term Portion of Long Term Debt";
		else
			tableString += unCamel( display );

		if( asset.indexOf( "Total" ) != -1 )
			tableString += "</b>";

		tableString += '</td>';
		tableString += '<td></td>';
		tableString += '<td></td>';
		tableString += '<td class="text-right">' + ( statementArray[0][asset]['content'] == "-" ? "-" : accountify( parseInt( statementArray[0][asset]['content'] ), "" ) ) + '</td>';
		tableString += '<td class="text-right">' + ( statementArray[1][asset]['content'] == "-" ? "-" : accountify( parseInt( statementArray[1][asset]['content'] ), "" ) ) + '</td>';
		tableString += '<td class="text-right">' + ( statementArray[2][asset]['content'] == "-" ? "-" : accountify( parseInt( statementArray[2][asset]['content'] ), "" ) ) + '</td>';

		tableString += '</tr>';

		if( asset == "TotalAssets" ) {
			tableString += '<tr><td><b>Liabilities</b></td><td></td><td></td><td></td><td></td><td></td></tr>';
			current = true;
			tableString += '<tr><td><b>&nbsp;&nbsp;&nbsp;Current Liabilities</b></td><td></td><td></td><td></td><td></td><td></td></tr>';
		}

		if( asset == "TotalLiabilities" )
			tableString += '<tr><td><b>Equity</b></td><td></td><td></td><td></td><td></td><td></td></tr><tr></tr>';
	}

    // ....annnnnd Fin :D
    tableString += '</tbody></table>';

    $("#bsSection").append( tableString );
}

function genRatios( statementArray ) {
	$("#loading").remove();
	var tableString = "";

	// Generate header
	tableString += '<h4 id="balanceHeader">Balance Sheet Ratios for ' + quoteR.value + '</h4>';

	tableString += '<table id="balanceSheetTable" class="table table-hover">' +
    					'<thead><tr>' +
    						'<th class="text-center">Asset</th>' +
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
    tableString += '<td>&nbsp;&nbsp;&nbsp;Debt-Equity Ratio</td>';
    tableString += '<td></td>';
    tableString += '<td></td>';
    tableString += '<td class="text-right">' + debtEquityRatio( statementArray[0]['LongTermDebt']['content'], statementArray[0]['Short_CurrentLongTermDebt']['content'], statementArray[0]['TotalStockholderEquity']['content'] ) + '</td>';
    tableString += '<td class="text-right">' + debtEquityRatio( statementArray[1]['LongTermDebt']['content'], statementArray[1]['Short_CurrentLongTermDebt']['content'], statementArray[1]['TotalStockholderEquity']['content'] ) + '</td>';
    tableString += '<td class="text-right">' + debtEquityRatio( statementArray[2]['LongTermDebt']['content'], statementArray[2]['Short_CurrentLongTermDebt']['content'], statementArray[2]['TotalStockholderEquity']['content'] ) + '</td>';
    tableString += '</tr>';

    // ....annnnnd Fin :D
    tableString += '</tbody></table>';

    $("#bsrSection").append( tableString );

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

	console.log( ltdebt );
	console.log( stdebt );
	console.log( tsEquity );
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