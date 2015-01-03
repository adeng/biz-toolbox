$(document).ready( function() {
	$('#depPerEquity').tooltip({ container: 'body' });
	$('#AFSTaxRate').tooltip({ container: 'body' });
	$("#bookValueEquity").tooltip({ container: 'body' });
	$("#overEquity").tooltip({ container: 'body' });

});

// Shared

function sorter( arrayName )
{
	arrayName.sort( function( a, b ) {
		var dateA = new Date( a[1] );
		var dateB = new Date( b[1] );

		return dateA.getTime() - dateB.getTime();
	});
}

// Trading Securities
var tradingArray = new Array();
var tradingShares = 0;
var tradingPurchaseArray = new Array();

function tradingSort()
{
	var tradingOrigPrice = 0;
	var tradingBalance = 0;
	var tradingPurchase = 0;
	tradingShares = 0;

	sorter( tradingArray );

	for ( var i = 0; i < tradingArray.length; i++ ) 
	{
		switch( tradingArray[i][3] )
		{
			case "Purchase":
				tradingBalance += parseInt(tradingArray[i][0]);
				tradingShares += parseInt(tradingArray[i][5]);
				tradingOrigPrice = parseInt(tradingArray[i][4]);
				break;

			case "Dividend":
				tradingArray[i][0] = Math.round(tradingArray[i][4] * tradingShares);
				break;

			case "Adjustment":
				tradingArray[i][0] = balanceDrCr( tradingShares * tradingArray[i][4], tradingBalance );
				tradingBalance += tradingArray[i][0];
				break;

			case "Sale":
				tradingBalance += parseInt(tradingArray[i][5] * tradingOrigPrice);
				tradingShares += parseInt(tradingArray[i][5]);
				tradingArray[i][6] = tradingArray[i][5] * tradingOrigPrice;

				break;
		}
		tradingArray[i][2] = tradingBalance;
	}

	console.log(tradingBalance);
	if ( tradingShares == 0 ) 
	{
		var lastDate = new Date( tradingArray[tradingArray.length - 1][1] );
		lastDate.setMinutes( lastDate.getMinutes() + lastDate.getTimezoneOffset() );
		tradingArray.push( [-1 * tradingBalance, lastDate.getFullYear() + "-12-31", 0, "Adjustment"] );
	}
}

function tradingAddPurchase( price, shares, date )
{
	if ( tradingPurchaseArray.length != 0 )
	{
		tradingDisplayWarning( "This application does not support multiple purchases yet!" );
		return;
	}

	if ( price == "" || shares == "" || date == "" )
	{
		tradingDisplayError("Missing information!");
		return;
	}

	var entry = [ price * shares, date, , "Purchase", price, shares ];

	tradingArray.push( entry );
	tradingPurchaseArray.push( [ price, date, shares ]);
	tradingSort();

	tradingUpdateTable();
}

function tradingAddDividend( price, date )
{
	if ( price == "" || date == "" )
	{
		tradingDisplayError("Missing information!");
		return;
	}

	var entry = [ price, date, , "Dividend", price ];

	if ( tradingBeforePurchase( date ))
		tradingDisplayError("Cannot receive dividend before stock is purchased!");
	else
	{
		tradingArray.push( entry );
		tradingSort();

		tradingUpdateTable();
	}
}

function tradingAdjustment( price, year )
{
	if ( price == "" || year == "" )
	{
		tradingDisplayError("Missing information!");
		return;
	}

	// Adjustment amount
	var entry = [ , year + "-12-31", , "Adjustment", price ];

	if ( tradingBeforePurchase( year + "-12-31" ))
		tradingDisplayError("Cannot make adjustment before stock is purchased!");
	else
	{
		tradingArray.push( entry );
		tradingSort();

		tradingUpdateTable();	
	}
}

function tradingAddSale( price, shares, date )
{
	if ( price == "" || shares == "" || date == "" )
	{
		tradingDisplayError("Missing information!");
		return;
	}

	var entry = [ -1 * price * shares, date, , "Sale", price, -1 * shares ];

	if ( tradingBeforePurchase( date ))
		tradingDisplayError("Cannot make sale before stock is purchased!");
	else if ( tradingShares < shares )
		tradingDisplayError("Cannot sell more shares than the company has!");
	else
	{
		tradingArray.push( entry );
		tradingSort();

		tradingUpdateTable();
	}
}

function tradingBeforePurchase( date )
{
	sorter( tradingPurchaseArray );

	if ( tradingPurchaseArray.length == 0 )
		return true;
	else
	{
		var d1 = new Date( tradingPurchaseArray[0][1] );
		var d2 = new Date( date );
		if ( d1.getTime() > d2.getTime() )
			return true;
	}

	return false;
}

function tradingUpdateTable()
{
	$("#tradingEntries tbody").empty();

	for ( var i = 0; i < tradingArray.length; i++ )
		$("#tradingEntries tbody").append('<tr><td>' + (i + 1) + '</td><td>' + accountify( tradingArray[i][0], "" ) + '</td><td>' + tradingArray[i][1] + '</td><td>$' + accountify( tradingArray[i][2], "" ) + '</td><td>' + tradingArray[i][3] + '</td></tr>');

}

function tradingJEGeneration()
{
	if ( tradingArray.length == 0 ) 
	{
		tradingDisplayError("No information has been submitted!");
		return;
	}

	var JEArray = new Array();
	for ( var i = 0; i < tradingArray.length; i++ )
	{
		var tempArray = new Array();
		switch( tradingArray[i][3] )
		{
			case "Purchase":
				tempArray.push( ["Short-Term Investments", tradingArray[i][0], tradingArray[i][1]] );
				tempArray.push( ["Cash", -1 * tradingArray[i][0], tradingArray[i][1]] );
				break;

			case "Sale":
				tempArray.push( ["Cash", -1 * tradingArray[i][0], tradingArray[i][1]] );
				tempArray.push( ["Short-Term Investments", tradingArray[i][6], tradingArray[i][1]] );

				var diff = tradingArray[i][6] - tradingArray[i][0];
				if ( diff > 0 )
					tempArray.push( ["Gain on Sale", -1 * diff, tradingArray[i][1] ] );
				else if ( diff < 0 )
					tempArray.push( ["Loss on Sale", -1 * diff, tradingArray[i][1] ] );
				break;

			case "Adjustment":
				if ( tradingArray[i][0] > 0 ) 
				{
					tempArray.push( ["Unrecognized Gain - I/S", -1 * tradingArray[i][0], tradingArray[i][1]] );
					tempArray.push( ["Valuation Allowance", tradingArray[i][0], tradingArray[i][1]] );
				}
				else if ( tradingArray[i][0] < 0 )
				{
					tempArray.push( ["Unrecognized Loss - I/S", -1 * tradingArray[i][0], tradingArray[i][1]] );
					tempArray.push( ["Valuation Allowance", tradingArray[i][0], tradingArray[i][1]] );
				}
				break;

			case "Dividend":
				tempArray.push( ["Cash", tradingArray[i][0], tradingArray[i][1]] );
				tempArray.push( ["Dividend Revenue", -1 * tradingArray[i][0], tradingArray[i][1]] );
				break;
		}

		JEArray.push( tempArray );		
	}

	$("#tradingContainer").html(generateJESeries( JEArray, "trading" ));
}

function tradingDisplayError( errorText )
{
    $(this).scrollTop(0);
    $("#tradingErrorText").text( errorText );
    $("#tradingErrorDiv").show().delay(1500).fadeOut( "slow", function() { $("#tradingErrorDiv").hide(); } );
}

function tradingDisplayWarning( errorText )
{
    $(this).scrollTop(0);
    $("#tradingWarningText").text( errorText );
    $("#tradingWarningDiv").show().delay(1500).fadeOut( "slow", function() { $("#tradingWarningDiv").hide(); } );
}

// Available-For-Sale Securities
var AFSArray = new Array();
var AFSShares = 0;
var AFSPurchaseArray = new Array();
var AFSTaxes = false;

function AFSSort()
{
	var AFSOrigPrice = 0;
	var AFSBalance = 0;
	var AFSPurchase = 0;
	AFSShares = 0;

	sorter( AFSArray );

	for ( var i = 0; i < AFSArray.length; i++ ) 
	{
		switch( AFSArray[i][3] )
		{
			case "Purchase":
				AFSBalance += parseInt(AFSArray[i][0]);
				AFSShares += parseInt(AFSArray[i][5]);
				AFSOrigPrice = parseInt(AFSArray[i][4]);
				break;

			case "Dividend":
				AFSArray[i][0] = Math.round(AFSArray[i][4] * AFSShares);
				break;

			case "Adjustment":
				if ( !AFSTaxes )
				{
					AFSArray[i][0] = balanceDrCr( AFSShares * AFSArray[i][4], AFSBalance );
					AFSBalance += AFSArray[i][0];
				}
				else
				{
					AFSArray[i][0] = Math.round( balanceDrCr( AFSShares * AFSArray[i][4], AFSBalance ) * ((100 - AFSTaxRate.value)/100 ));
					AFSArray[i][6] = Math.round( balanceDrCr( AFSShares * AFSArray[i][4], AFSBalance ) * (AFSTaxRate.value/100));
					AFSBalance += balanceDrCr( AFSShares * AFSArray[i][4], AFSBalance );
					/*
					if ( typeof AFSArray[i][7] == "undefined" ) 
					{
						var taxEntry = [ AFSArray[i][6], AFSArray[AFSArray.length - 1][1], AFSBalance, "Tax" ];
						AFSArray.push(taxEntry);
						AFSArray[i][7] = 1;
					}*/
				}
				break;

			case "Sale":
				AFSBalance += parseInt(AFSArray[i][5] * AFSOrigPrice);
				AFSShares += parseInt(AFSArray[i][5]);
				AFSArray[i][6] = AFSArray[i][5] * AFSOrigPrice;

				break;
		}
		AFSArray[i][2] = AFSBalance;
	}

	console.log(AFSBalance);
	if ( AFSShares == 0 ) 
	{
		var lastDate = new Date( AFSArray[AFSArray.length - 1][1] );
		lastDate.setMinutes( lastDate.getMinutes() + lastDate.getTimezoneOffset() );
		AFSArray.push( [-1 * AFSBalance, lastDate.getFullYear() + "-12-31", 0, "Adjustment"] );
	}
}

function AFSAddPurchase( price, shares, date )
{
	if ( AFSPurchaseArray.length != 0 )
	{
		AFSDisplayWarning( "This application does not support multiple purchases yet!" );
		return;
	}

	if ( price == "" || shares == "" || date == "" )
	{
		AFSDisplayError("Missing information!");
		return;
	}

	var entry = [ price * shares, date, , "Purchase", price, shares ];

	AFSArray.push( entry );
	AFSPurchaseArray.push( [ price, date, shares ]);
	AFSSort();

	AFSUpdateTable();
}

function AFSAddDividend( price, date )
{
	if ( price == "" || date == "" )
	{
		AFSDisplayError("Missing information!");
		return;
	}

	var entry = [ price, date, , "Dividend", price ];

	if ( AFSBeforePurchase( date ))
		AFSDisplayError("Cannot receive dividend before stock is purchased!");
	else
	{
		AFSArray.push( entry );
		AFSSort();

		AFSUpdateTable();
	}
}

function AFSAdjustment( price, year )
{
	if ( price == "" || year == "" )
	{
		AFSDisplayError("Missing information!");
		return;
	}

	if ( AFSTaxes && AFSTaxRate.value == "" )
	{
		AFSDisplayError("Please specify a tax rate!");
		return;
	}

	// Adjustment amount
	var entry = [ , year + "-12-31", , "Adjustment", price ];

	if ( AFSBeforePurchase( year + "-12-31" ))
		AFSDisplayError("Cannot make adjustment before stock is purchased!");
	else
	{
		AFSArray.push( entry );
		AFSSort();

		AFSUpdateTable();	
	}
}

function AFSAddSale( price, shares, date )
{
	if ( price == "" || shares == "" || date == "" )
	{
		AFSDisplayError("Missing information!");
		return;
	}

	var entry = [ -1 * price * shares, date, , "Sale", price, -1 * shares ];

	if ( AFSBeforePurchase( date ))
		AFSDisplayError("Cannot make sale before stock is purchased!");
	else if ( AFSShares < shares )
		AFSDisplayError("Cannot sell more shares than the company has!");
	else
	{
		AFSArray.push( entry );
		AFSSort();

		AFSUpdateTable();
	}
}

function AFSBeforePurchase( date )
{
	sorter( AFSPurchaseArray );

	if ( AFSPurchaseArray.length == 0 )
		return true;
	else
	{
		var d1 = new Date( AFSPurchaseArray[0][1] );
		var d2 = new Date( date );
		if ( d1.getTime() > d2.getTime() )
			return true;
	}

	return false;
}

function AFSUpdateTable()
{
	$("#AFSEntries tbody").empty();

	for ( var i = 0; i < AFSArray.length; i++ )
		$("#AFSEntries tbody").append('<tr><td>' + (i + 1) + '</td><td>' + accountify( AFSArray[i][0], "" ) + '</td><td>' + AFSArray[i][1] + '</td><td>$' + accountify( AFSArray[i][2], "" ) + '</td><td>' + AFSArray[i][3] + '</td></tr>');

}

function AFSJEGeneration()
{
	if ( AFSArray.length == 0 ) 
	{
		AFSDisplayError("No information has been submitted!");
		return;
	}

	if ( AFSTaxes && AFSTaxRate.value == "" )
	{
		AFSDisplayError("Please specify a tax rate!");
		return;
	}

	var JEArray = new Array();
	for ( var i = 0; i < AFSArray.length; i++ )
	{
		var tempArray = new Array();
		switch( AFSArray[i][3] )
		{
			case "Purchase":
				tempArray.push( ["Available-For-Sale Securities", AFSArray[i][0], AFSArray[i][1]] );
				tempArray.push( ["Cash", -1 * AFSArray[i][0], AFSArray[i][1]] );
				break;

			case "Sale":
				tempArray.push( ["Cash", -1 * AFSArray[i][0], AFSArray[i][1]] );
				tempArray.push( ["Short-Term Investments", AFSArray[i][6], AFSArray[i][1]] );

				var diff = AFSArray[i][6] - AFSArray[i][0];
				if ( diff > 0 )
					tempArray.push( ["Gain on Sale", -1 * diff, AFSArray[i][1] ] );
				else if ( diff < 0 )
					tempArray.push( ["Loss on Sale", -1 * diff, AFSArray[i][1] ] );
				break;

			case "Adjustment":
				if ( !AFSTaxes )
				{
					if ( AFSArray[i][0] > 0 ) 
					{
						tempArray.push( ["Unrecognized Gain - OCI", -1 * AFSArray[i][0], AFSArray[i][1]] );
						tempArray.push( ["Valuation Allowance", AFSArray[i][0], AFSArray[i][1]] );
					}
					else if ( AFSArray[i][0] < 0 )
					{
						tempArray.push( ["Unrecognized Loss - OCI", -1 * AFSArray[i][0], AFSArray[i][1]] );
						tempArray.push( ["Valuation Allowance", AFSArray[i][0], AFSArray[i][1]] );
					}
				}
				else
				{
					if ( AFSArray[i][0] > 0 ) 
					{
						tempArray.push( ["Unrecognized Gain - OCI", -1 * AFSArray[i][0], AFSArray[i][1]] );
						tempArray.push( ["Valuation Allowance", AFSArray[i][0] + AFSArray[i][6], AFSArray[i][1]] );
						tempArray.push( ["Deferred Tax Liability", -1 * AFSArray[i][6], AFSArray[i][1]] );
					}
					else if ( AFSArray[i][0] < 0 )
					{
						tempArray.push( ["Unrecognized Loss - OCI", -1 * AFSArray[i][0], AFSArray[i][1]] );
						tempArray.push( ["Valuation Allowance", AFSArray[i][0] + AFSArray[i][6], AFSArray[i][1]] );
						tempArray.push( ["Deferred Tax Asset", -1 * AFSArray[i][6], AFSArray[i][1]] );
					}
				}
				
				break;

			case "Dividend":
				tempArray.push( ["Cash", AFSArray[i][0], AFSArray[i][1]] );
				tempArray.push( ["Dividend Revenue", -1 * AFSArray[i][0], AFSArray[i][1]] );
				break;

			case "Tax":
				if ( AFSArray[i][0] > 0 )
				{
					tempArray.push( ["Deferred Tax Equity", AFSArray[i][0], AFSArray[i][1]] );
					tempArray.push( ["Income Tax Expense", -1 * AFSArray[i][0], AFSArray[i][1]] );
				}
				else if ( AFSArray[i])
				{
					tempArray.push( ["Deferred Tax Equity", AFSArray[i][0], AFSArray[i][1]] );
					tempArray.push( ["Income Tax Expense", -1 * AFSArray[i][0], AFSArray[i][1]] );
				}
				break;
		}

		JEArray.push( tempArray );		
	}

	$("#AFSContainer").html(generateJESeries( JEArray, "AFS" ));
}

function AFSDisplayError( errorText )
{
    $(this).scrollTop(0);
    $("#AFSErrorText").text( errorText );
    $("#AFSErrorDiv").show().delay(1500).fadeOut( "slow", function() { $("#AFSErrorDiv").hide(); } );
}

function AFSDisplayWarning( errorText )
{
    $(this).scrollTop(0);
    $("#AFSWarningText").text( errorText );
    $("#AFSWarningDiv").show().delay(1500).fadeOut( "slow", function() { $("#AFSWarningDiv").hide(); } );
}

// Significant Influence Securities
var equityArray = new Array();
var deprAssets = false;

function equitySort()
{
	var equityBalance = 0;
	var percentage = -1;

	sorter( equityArray );

	for ( var i = 0; i < equityArray.length; i++ )
	{
		switch( equityArray[i][3] )
		{
			case "Purchase":
				percentage = equityArray[i][4];
				equityBalance += parseInt(equityArray[i][0]);
				break;

			case "Earnings":
				equityArray[i][0] = Math.round( equityArray[i][4] * percentage );
				equityBalance += parseInt(equityArray[i][0]);
				break;

			case "Sale":
				percentage *= ( 1 - equityArray[i][4] );
				equityArray[i][5] = equityBalance * equityArray[i][4];
				equityBalance = Math.round( equityBalance * ( 1 - equityArray[i][4]));
				break;

			default:
				equityBalance += parseInt(equityArray[i][0]);
				break;
		}
		
		equityArray[i][2] = equityBalance;

		if ( percentage < 0.2 )
			equityDisplayWarning("The ownership percentage of " + ( percentage * 100 ) + "% is smaller than the 20% threshold. Check that the equity method is still applicable.");
	}
}

function equityAddPurchase( ownPercent, purchAmt, date, life, deprPercent, overvalue )
{
	if ( equityArray.length != 0 )
	{
		equityDisplayWarning( "This application does not support multiple purchases yet!" );
		return;
	}

	if ( ( ownPercent == "" || purchAmt == "" || date == "" ) || ( deprAssets && ( life == "" || deprPercent == "" || overvalue == "" )))
	{
		equityDisplayError( "Missing information!" );
		return;
	}

	if ( ownPercent < 20 )
		bootbox.confirm("This percentage is less than the 20% threshold. Are you SURE there is significant influence?", function( result ) {
			if ( result )
			{
				equityAddPurchaseHelper( purchAmt, date, life, deprPercent, overvalue, ownPercent );
			}
		});
	else
	{
		equityAddPurchaseHelper( purchAmt, date, life, deprPercent, overvalue, ownPercent );		
	}
}

function equityAddPurchaseHelper( purchAmt, date, life, deprPercent, overvalue, ownPercent )
{
	equityArray.push( [ parseInt(purchAmt), date, parseInt(purchAmt), "Purchase", ownPercent / 100 ] );
	if ( deprAssets )
	{
		var d = new Date( date );
		d.setMinutes( d.getMinutes() + d.getTimezoneOffset() );
		d.setFullYear( d.getFullYear() - 1 );
		for ( var i = 0; i < life; i++ )
		{
			var a = new Date( d.setFullYear( d.getFullYear() + 1 ));
			var dateString = a.getFullYear() + "-12-31";
			equityArray.push( [ -1 * Math.round( ( overvalue * ( deprPercent / 100 )) / life ), dateString, , "Depreciation" ]);		
		}
	}

	equitySort();

	equityUpdateTable();
}

function equityAddEarnings( earnings, date )
{
	if ( earnings == "" || date == "" )
	{
		equityDisplayError("Missing information!");
		return;
	}
	
	if ( equityArray.length == 0 || new Date(equityArray[0][1]).getTime() > new Date( date ).getTime() )
	{
		equityDisplayError("Cannot record earnings before investment is purchased!");
		return;
	}

	var entry = [ , date, , "Earnings" ];

	var d = new Date( equityArray[0][1] );
	var e = new Date( date );
	if ( d.getFullYear() == e.getFullYear() )
	{
		var amt = Math.round( earnings );
		if ( d.getDate() < 15 )
			amt *= (((e.getMonth() + 1) - ( d.getMonth() )) / ( e.getMonth() + 1 ));
		else
			amt *= (((e.getMonth() + 1) - ( d.getMonth() + 1 )) / ( e.getMonth() + 1 ));

		entry[4] = amt;
	}
	else
		entry[4] = Math.round( earnings );

	equityArray.push( entry );
	equitySort();

	equityUpdateTable();
}

function equityAddDividend( dividends, date )
{
	if ( dividends == "" || date == "" )
	{
		equityDisplayError("Missing information!");
		return;
	}

	if ( equityArray.length == 0 || new Date(equityArray[0][1]).getTime() > new Date( date ).getTime()  )
	{
		equityDisplayError("Cannot receive dividends before investment is purchased!");
		return;
	}

	var entry = [ , date, , "Dividend" ];

	var d = new Date( equityArray[0][1] );
	if ( d.getFullYear() == new Date(date).getFullYear() )
	{
		var amt = Math.round( dividends );
		if ( d.getDate() < 15 )
			amt *= ((12 - ( d.getMonth() )) / 12);
		else
			amt *= ((12 - ( d.getMonth() + 1 )) / 12)

		entry[0] = -1 * amt;
	}
	else
		entry[0] = -1 * Math.round( dividends );

	equityArray.push( entry );
	equitySort();

	equityUpdateTable();
}

function equityAddSale( sale, percent, date )
{
	if ( sale == "" || date == "" )
	{
		equityDisplayError("Missing information!");
		return;
	}

	if ( equityArray.length == 0 || new Date(equityArray[0][1]).getTime() > new Date( date ).getTime() )
	{
		equityDisplayError("Cannot make sale before investment is purchased!");
		return;
	}

	var entry = [ -1 * sale, date, , "Sale", (percent / 100) ];

	equityArray.push( entry );
	equitySort();

	equityUpdateTable();
}

function equityUpdateTable()
{
	$("#equityEntries tbody").empty();

	for ( var i = 0; i < equityArray.length; i++ )
		$("#equityEntries tbody").append('<tr><td>' + (i + 1) + '</td><td>' + accountify( equityArray[i][0], "" ) + '</td><td>' + equityArray[i][1] + '</td><td>$' + accountify( equityArray[i][2], "" ) + '</td><td>' + equityArray[i][3] + '</td></tr>');

}

function equityDisplayError( errorText )
{
    $(this).scrollTop(0);
    $("#EquityErrorText").text( errorText );
    $("#EquityErrorDiv").show().delay(1500).fadeOut( "slow", function() { $("#EquityErrorDiv").hide(); } );
}

function equityDisplayWarning( errorText )
{
    $(this).scrollTop(0);
    $("#EquityWarningText").text( errorText );
    $("#EquityWarningDiv").show().delay(1500).fadeOut( "slow", function() { $("#EquityWarningDiv").hide(); } );
}

function equityJEGeneration()
{
	if ( equityArray.length == 0 ) 
	{
		equityDisplayError("No information has been submitted!");
		return;
	}

	var JEArray = new Array();
	for ( var i = 0; i < equityArray.length; i++ )
	{
		var tempArray = new Array();
		switch( equityArray[i][3] )
		{
			case "Purchase":
				tempArray.push( ["Investment in Investee", equityArray[i][0], equityArray[i][1]] );
				tempArray.push( ["Cash", -1 * equityArray[i][0], equityArray[i][1]] );
				break;

			case "Earnings":
				tempArray.push( ["Investment in Investee", equityArray[i][0], equityArray[i][1]] );
				tempArray.push( ["Investment Revenue", -1 * equityArray[i][0], equityArray[i][1]] );
				break;

			case "Dividend":
				tempArray.push( ["Cash", -1 * equityArray[i][0], equityArray[i][1]] );
				tempArray.push( ["Investment in Investee", equityArray[i][0], equityArray[i][1]] );
				break;

			case "Depreciation":
				tempArray.push( ["Investment Revenue", -1 * equityArray[i][0], equityArray[i][1]] );
				tempArray.push( ["Investment in Investee", equityArray[i][0], equityArray[i][1]] );
				break;

			case "Sale":
				tempArray.push( ["Cash", -1 * equityArray[i][0], equityArray[i][1]] );
				tempArray.push( ["Investment in Investee", -1 * equityArray[i][5], equityArray[i][1]] );

				var diff = equityArray[i][0] + equityArray[i][5];
				if ( diff < 0 )
				{
					tempArray.push( ["Gain on Sale", diff, equityArray[i][1]] );
				}
				else if ( diff > 0 )
				{
					tempArray.push( ["Loss on Sale", diff, equityArray[i][1]] );
				}
				break;
		}

		JEArray.push( tempArray );		
	}

	$("#equityContainer").html(generateJESeries( JEArray, "equity" ));
}

function updatePurchaseValue( percent, price )
{
	if ( percent != "" && price != "" )
	{
		$("#impliedPurchaseValueEquity").data( "value", Math.round( price / ( percent / 100 ) ));
		$("#impliedPurchaseValueEquity").val( accountify( Math.round(( price / ( percent / 100 ))), "" ));
	}

	clearDisabled();
}

var chosen = "";

function oneOrOther()
{
	if ( chosen == "" )
	{
		if( bookValueEquity.value != "" )
		{
			$("#overEquity").prop('disabled', 'true');
			chosen = "bookValueEquity";
		}
		else if ( overEquity.value != "" )
		{
			$("#bookValueEquity").prop('disabled', 'true');
			chosen = "overEquity";
		}

		if ( impliedPurchaseValueEquity.value != "" )
		{
			clearDisabled();
		}
	}
	else
	{
		if ( chosen == "bookValueEquity" && bookValueEquity.value == "" )
		{
			$("#overEquity").removeAttr('disabled');
			$("#overEquity").attr('type', 'number');
			$("#overEquity").val("");
			chosen = "";
		}
		else if ( chosen == "overEquity" && overEquity.value == "" )
		{
			$("#bookValueEquity").removeAttr('disabled');
			$("#bookValueEquity").attr('type', 'number');
			$("#bookValueEquity").val("");
			chosen = "";
		}

		clearDisabled();
	}
}

function clearDisabled()
{
	switch( chosen )
	{
		case "bookValueEquity":
			var overvalue = bookValueEquity.value - $("#impliedPurchaseValueEquity").data( "value" );
			$("#bookValueEquity").data( 'value', bookValueEquity.value );
			$("#overEquity").data( 'value', overvalue );

			$("#overEquity").attr('type', 'text');
			$("#overEquity").val( accountify( overvalue, "" ));
			break;

		case "overEquity":
			var bookValue = $("#impliedPurchaseValueEquity").data( "value" ) - overEquity.value;
			$("#bookValueEquity").data( 'value', bookValue );
			$("#overEquity").data( 'value', overEquity.value );

			$("#bookValueEquity").attr('type', 'text');
			$("#bookValueEquity").val( accountify( bookValue, "" ));
			break;
	}
}