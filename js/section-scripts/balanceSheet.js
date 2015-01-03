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
	tableString += '<h4 id="balanceHeader">Balance Sheet Ratios for ' + quote.value + '</h4>';

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
    tableString += '<tr>';
    tableString += '<td>Current Ratio</td>';
    tableString += '<td></td>';
    tableString += '<td></td>';
    tableString += '<td class="text-right">' + currentRatio( statementArray[0]['TotalCurrentAssets']['content'], statementArray[0]['TotalCurrentLiabilities']['content'] ) + '</td>';
    tableString += '<td class="text-right">' + currentRatio( statementArray[1]['TotalCurrentAssets']['content'], statementArray[1]['TotalCurrentLiabilities']['content'] ) + '</td>';
    tableString += '<td class="text-right">' + currentRatio( statementArray[2]['TotalCurrentAssets']['content'], statementArray[2]['TotalCurrentLiabilities']['content'] ) + '</td>';
    tableString += '</tr>';

    // ....annnnnd Fin :D
    tableString += '</tbody></table>';

    $("#bsrSection").append( tableString );

}

// Calculator functions
function currentRatio( currAssets, currLiabilities )
{
	console.log( currAssets );
	console.log( currLiabilities );
	var ca = parseInt( currAssets );
	var cl = parseInt( currLiabilities );
	if( ca == 0 || cl == 0 || ca * 1 != ca || cl * 1 != cl )
		return "-";
	else
		return ( ca / cl ).toFixed( 2 );
}