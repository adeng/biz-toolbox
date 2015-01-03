function genBalanceSheet( statementArray ) {
	$("#loading").remove();
	var tableString = "";
	// Generate header
	tableString += '<table id="balanceSheetTable" class="table table-hover">' +
    					'<thead><tr>' +
    						'<th class="text-center">Asset</th>' +
    						'<th></th>' +
    						'<th></th>' +
    						'<th class="text-center">' + statementArray[0]['period'] + '</th>' +
    						'<th class="text-center">' + statementArray[1]['period'] + '</th>' +
    						'<th class="text-center">' + statementArray[2]['period'] + '</th>' +
    					'</tr></thead><tbody>';

    tableString += '<tr><td><b>Assets</b></td><td></td><td></td><td></td><td></td><td></td>';

   	for( var i = 0; i < Object.keys( statementArray[0] ).length; i++ )
	{
		var asset = Object.keys( statementArray[0] )[i];
		var display = asset;
		if( asset == "period" )
			continue;

		tableString += '<tr>';

		if( asset.indexOf( "Total" ) != -1 )
			tableString += '<b>';

		tableString += '<td>&nbsp;&nbsp;&nbsp;' + display + '</td>';
		tableString += '<td></td>';
		tableString += '<td></td>';
		tableString += '<td class="text-right">' + ( statementArray[0][asset]['content'] == "-" ? "-" : accountify( parseInt( statementArray[0][asset]['content'] ), "" ) ) + '</td>';
		tableString += '<td class="text-right">' + ( statementArray[1][asset]['content'] == "-" ? "-" : accountify( parseInt( statementArray[1][asset]['content'] ), "" ) ) + '</td>';
		tableString += '<td class="text-right">' + ( statementArray[2][asset]['content'] == "-" ? "-" : accountify( parseInt( statementArray[2][asset]['content'] ), "" ) ) + '</td>';

		if( asset.indexOf( "Total" ) != -1 )
			tableString += '</b>';

		tableString += '</tr>';

		if( asset == "TotalAssets" )
			tableString += '<tr><td><b>Liabilities</b></td><td></td><td></td><td></td><td></td><td></td>';

		if( asset == "TotalLiabilities" )
			tableString += '<tr><td><b>Equity</b></td><td></td><td></td><td></td><td></td><td></td>';
	}

    // ....annnnnd Fin :D
    tableString += '</tbody></table>';

    $("#bsSection").append( tableString );
}
