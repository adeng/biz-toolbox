function genBalanceSheet( statementArray ) {
	$("#loading").remove();
	var tableString = "";
	var current = false;
	// Generate header
	tableString += '<h4 id="balanceHeader">Balance Sheet for ' + quoteBS.value + '</h4>';

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

function genCashFlows( statementArray ) {
	$("#loading").remove();
	var tableString = "";
	var current = false;
	// Generate header
	tableString += '<h4 id="cashHeader">Statement of Cash Flows for ' + quoteCF.value + '</h4>';

	tableString += '<table id="cashFlowsTable" class="table table-hover">' +
    					'<thead><tr>' +
    						'<th class="text-center"></th>' +
    						'<th></th>' +
    						'<th></th>' +
    						'<th class="text-right">' + statementArray[0]['period'] + '</th>' +
    						'<th class="text-right">' + statementArray[1]['period'] + '</th>' +
    						'<th class="text-right">' + statementArray[2]['period'] + '</th>' +
    					'</tr></thead><tbody>';

    // Generate rest

   	// Generate OPActivities
   	tableString += '<tr><td><b>Cash from Operating Activities</b></td><td></td><td></td><td></td><td></td><td></td></tr>';

   	for( var i = 0; i < Object.keys( statementArray[0] ).length; i++ )
	{
		var asset = Object.keys( statementArray[0] )[i];
		var display = asset;
		if( asset == "period" )
			continue;

		tableString += '<tr>';
		tableString += '<td>&nbsp;&nbsp;&nbsp;';

		if( asset.indexOf( "Total" ) != -1 )
			tableString += '&nbsp;&nbsp;&nbsp;<b>';

		if( asset == "TotalCashFlowFromOperatingActivities" )
			tableString += "Total Cash Flows From Operating Activities";
		else if( asset == "OtherCashflowsfromInvestingActivities" )
			tableString += "Other Cash Flows From Investing Activities";
		else if( asset == "SalePurchaseofStock" )
			tableString += "Proceeds from Sale or Purchase of Stock";
		else if( asset == "OtherCashFlowsfromFinancingActivities" )
			tableString += "Other Cash Flows From Financing Activities";
		else if( asset == "ChangeInCashandCashEquivalents" )
			tableString += "Net Change in Cash and Cash Equivalents";
		else
			tableString += unCamel( display );

		if( asset.indexOf( "Total" ) != -1 )
			tableString += '</b>';

		tableString += '</td>';
		tableString += '<td></td>';
		tableString += '<td></td>';
		tableString += '<td class="text-right">' + ( statementArray[0][asset]['content'] == "-" ? "-" : accountify( parseInt( statementArray[0][asset]['content'] ), "" ) ) + '</td>';
		tableString += '<td class="text-right">' + ( statementArray[1][asset]['content'] == "-" ? "-" : accountify( parseInt( statementArray[1][asset]['content'] ), "" ) ) + '</td>';
		tableString += '<td class="text-right">' + ( statementArray[2][asset]['content'] == "-" ? "-" : accountify( parseInt( statementArray[2][asset]['content'] ), "" ) ) + '</td>';

		tableString += '</tr>';

		if( asset == "TotalCashFlowFromOperatingActivities" )
			tableString += '<tr><td><b>Cash From Investing Activities</b></td><td></td><td></td><td></td><td></td><td></td></tr>';

		if( asset == "TotalCashFlowsFromInvestingActivities" )
			tableString += '<tr><td><b>Cash From Financing Activities</b></td><td></td><td></td><td></td><td></td><td></td></tr>';
	}

    // ....annnnnd Fin :D
    tableString += '</tbody></table>';

    $("#cfSection").append( tableString );
}