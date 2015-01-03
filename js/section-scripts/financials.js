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

function genIncomeStatement( statementArray ) {
	$("#loading").remove();
	var tableString = "";
	var current = false;
	// Generate header
	tableString += '<h4 id="incomeHeader">Income Statement for ' + quote.value + '</h4>';

	tableString += '<table id="incomeStatementTable" class="table table-hover">' +
    					'<thead><tr>' +
    						'<th class="text-center"></th>' +
    						'<th></th>' +
    						'<th></th>' +
    						'<th class="text-right">' + statementArray[0]['period'] + '</th>' +
    						'<th class="text-right">' + statementArray[1]['period'] + '</th>' +
    						'<th class="text-right">' + statementArray[2]['period'] + '</th>' +
    					'</tr></thead><tbody>';

    // Generate rest

   	for( var i = 0; i < Object.keys( statementArray[0] ).length; i++ )
	{
		var asset = Object.keys( statementArray[0] )[i];
		var display = asset;
		if( asset == "period" )
			continue;

		tableString += '<tr><td>';

		if( asset == "CostofRevenue" )
			tableString += "Cost of Revenue";
		else if( asset == "ResearchDevelopment" )
			tableString += "Research and Development";
		else if( asset == "SellingGeneralandAdministrative" )
			tableString += "Selling, General, and Admin Expenses";
		else if( asset == "NonRecurring" )
			tableString += "Non-Recurring Expenses";
		else if( asset == "OperatingIncomeorLoss" )
			tableString += "Net Operating Income";
		else if( asset == "TotalOtherIncome_ExpensesNet" )
			tableString += "Net Other Income/Expenses";
		else
			tableString += unCamel( display );

		tableString += '</td>';
		tableString += '<td></td>';
		tableString += '<td></td>';
		tableString += '<td class="text-right">' + ( statementArray[0][asset]['content'] == "-" ? "-" : accountify( parseInt( statementArray[0][asset]['content'] ), "" ) ) + '</td>';
		tableString += '<td class="text-right">' + ( statementArray[1][asset]['content'] == "-" ? "-" : accountify( parseInt( statementArray[1][asset]['content'] ), "" ) ) + '</td>';
		tableString += '<td class="text-right">' + ( statementArray[2][asset]['content'] == "-" ? "-" : accountify( parseInt( statementArray[2][asset]['content'] ), "" ) ) + '</td>';

		tableString += '</tr>';
	}

    // ....annnnnd Fin :D
    tableString += '</tbody></table>';

    $("#icSection").append( tableString );
}