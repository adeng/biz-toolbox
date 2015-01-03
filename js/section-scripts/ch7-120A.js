$(document).ready( function() {
	$("#percDiscount").tooltip({ container: 'body' });
	$("#firstDDiscount").tooltip({ container: 'body' });
	$("#secondDDiscount").tooltip({ container: 'body' });
	$("#percentReturn").tooltip({ container: 'body' });
	$("#ratioReturn").tooltip({ container: 'body' });
	$("#prevCheck").tooltip({ container: 'body' });
});

// Sales Discounts

var discountArray = new Array();

function discountSort()
{
	discountBalance = 0;
	inTimeBalance = 0;

	var firstDate;
	var secondDate;
	var discountPercentage = 0;

	sorter( discountArray );

	for ( var i = 0; i < discountArray.length; i++ )
	{
		switch( discountArray[i][3] )
		{
			case "Purchase":
				discountBalance += parseInt( discountArray[i][0] );
				inTimeBalance += parseInt( discountArray[i][0] );
				firstDate = new Date( discountArray[i][1] );
				firstDate.setMinutes( firstDate.getMinutes() + firstDate.getTimezoneOffset() );
				firstDate.setDate( firstDate.getDate() + parseInt( discountArray[i][5] ));

				secondDate = new Date( discountArray[i][1] );
				secondDate.setMinutes( secondDate.getMinutes() + secondDate.getTimezoneOffset() );
				secondDate.setDate( secondDate.getDate() + parseInt( discountArray[i][6] ));

				discountPercentage = discountArray[i][4] / 100;
				break;

			case "Collection":
				var currDate = new Date( discountArray[i][1] );
				currDate.setMinutes( currDate.getMinutes() + currDate.getTimezoneOffset() );

				if ( currDate.getTime() < secondDate.getTime() ) 
				{
					inTimeBalance += parseInt( discountArray[i][0] );
				}

				discountBalance += parseInt( discountArray[i][0] );

				console.log( currDate.toLocaleString() );
				console.log( firstDate.toLocaleString() );

				if ( currDate.getTime() < firstDate.getTime() )
					discountArray[i][4] = Math.round( (1 - discountPercentage) * discountArray[i][0] );

				discountArray[i][2] = discountBalance;
				break;
		}

		discountArray[i][7] = inTimeBalance;
	}
}

function firstSub()
{
	$("#percDiscount").val(2);
	$("#firstDDiscount").val(10);
	$("#secondDDiscount").val(30);
}

function discountAddPurchase( amount, date, discount, firstDays, secondDays )
{
	if ( amount == "" || date == "" || discount == "" || firstDays == "" || secondDays == "" )
	{
		discountDisplayError( "Missing information!" );
		return;
	}

	if ( discountArray.length != 0 )
	{
		discountDisplayWarning( "This application does not support multiple sales yet!" );
		return;
	}

	var entry = [ amount, date, amount, "Purchase", discount, firstDays, secondDays ];

	discountArray.push( entry );
	discountSort();

	discountUpdateTable();

}

function discountAddCash( cash, date )
{
	if ( discountArray.length == 0 )
	{
		discountDisplayError( "Cannot make payments before purchase is made!" );
		return;
	}

	var entry = [ -1 * cash, date, , "Collection" ];

	discountArray.push( entry );
	discountSort();

	discountUpdateTable();
}

function discountDisplayError( errorText )
{
    $(this).scrollTop(0);
    $("#discountErrorText").text( errorText );
    $("#discountErrorDiv").show().delay(1500).fadeOut( "slow", function() { $("#discountErrorDiv").hide(); } );
}

function discountDisplayWarning( errorText )
{
    $(this).scrollTop(0);
    $("#discountWarningText").text( errorText );
    $("#discountWarningDiv").show().delay(1500).fadeOut( "slow", function() { $("#discountWarningDiv").hide(); } );
}

function discountUpdateTable()
{
	$("#discountEntries tbody").empty();

	for ( var i = 0; i < discountArray.length; i++ )
		$("#discountEntries tbody").append('<tr><td>' + (i + 1) + '</td><td>' + accountify( discountArray[i][0], "" ) + '</td><td>' + discountArray[i][1] + '</td><td>$' + accountify( discountArray[i][2], "" ) + '</td><td>' + discountArray[i][3] + '</td></tr>');
}

function discountJEGeneration()
{
	if ( discountArray.length == 0 )
	{
		discountDisplayError( "No information has been submitted!" );
		return;
	}

	var JEArray = new Array();
	for ( var i = 0; i < discountArray.length; i++ )
	{
		var tempArray = new Array();
		switch( discountArray[i][3] )
		{
			case "Purchase":
				tempArray.push( ["Accounts Receivable", discountArray[i][0], discountArray[i][1]] );
				tempArray.push( ["Sales Revenue", -1 * discountArray[i][0], discountArray[i][1]] );
				break;

			case "Collection":
				tempArray.push( ["Accounts Receivable", discountArray[i][0], discountArray[i][1]] );

				if ( typeof discountArray[i][4] == "undefined" )
					tempArray.push( ["Cash", -1 * discountArray[i][0], discountArray[i][1]] );
				else
				{
					var diff = discountArray[i][0] - discountArray[i][4];
					tempArray.push( ["Cash", -1 * discountArray[i][4], discountArray[i][1]] );
					tempArray.push( ["Sales Discounts", -1 * diff, discountArray[i][1]] );
				}
				break;
		}

		JEArray.push( tempArray );
	}

	if ( discountArray[discountArray.length - 1][7] > 0 )
	{
		$("#discountPermWarningDiv").html('<div class="alert alert-warning alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button><strong>Warning:</strong> <span id="discountPermWarningText">This is text that should be replaced</span></div>');
		$("#discountPermWarningText").text( accountify( discountArray[discountArray.length - 1][7], "" ) + " was not paid off in the days specified (" + discountArray[0][6] + " days)!") ;
	}
	else
	{
		$("#discountPermWarningDiv").html('');
	}

	$("#discountContainer").html(generateJESeries( JEArray, "discount" ));
}

// Returns

var returnArray = new Array();
var groupArray = new Array();
var yearArray = new Array();
var firstReturn = false;
var oldReturn = false;

function returnSort()
{
	var returnBalance = 0;
	var invBalance = 0;
	var returnPercentage = 0;
	var returnAllowance = 0;

	sorter( returnArray );

	for ( var i = 0; i < returnArray.length; i++ )
	{
		switch( returnArray[i][3] )
		{
			case "Sale":
				returnPercentage = parseInt(groupArray[returnArray[i][4]]) / 100;
				returnBalance += parseInt(returnArray[i][0]);

				returnArray[i][2] = returnBalance;
				break;

			case "Inventory Reduction":
				invBalance += parseInt(returnArray[i][0]);

				returnArray[i][2] = invBalance;
				break;

			case "Sales Return":
				returnAllowance -= parseInt(returnArray[i][0]);

				returnArray[i][2] = returnAllowance;
				break;

			case "Inventory Return":
				invBalance += parseInt(returnArray[i][0]);

				returnArray[i][2] = invBalance;
				break;

			case "Allowance":
				returnAllowance -= returnArray[i][0];

				returnArray[i][2] = returnAllowance;
				break;

			case "Sales Return - Estimated":
				if ( typeof returnArray[i][0] != "undefined" )
					returnAllowance += returnArray[i][0];
				else 
				{
					var d = new Date( returnArray[i][1] );
					d.setMinutes( d.getMinutes() + d.getTimezoneOffset() );

					// TODO: Check whether you decrease allowance if allowance exceeds estimate
					returnArray[i][0] = yearArray[d.getFullYear()][1] + returnAllowance;
					returnArray[i + 1][0] = ( parseInt( yearArray[d.getFullYear()][1] ) + returnAllowance ) * yearArray[d.getFullYear()][0];

					returnAllowance += returnArray[i][0]; 
				}

				returnArray[i][2] = returnAllowance;
				break;

			case "Inventory Return - Estimated":
				var d = new Date( returnArray[i][1] );
				d.setMinutes( d.getMinutes() + d.getTimezoneOffset() );

				// TODO: Check whether you decrease allowance if allowance exceeds estimate
				invBalance += returnArray[i][0]; 
				
				returnArray[i][2] = invBalance;
				break;
		}
	}
}

function returnAddSale( sale, returnPercent, cogs, date )
{
	if ( sale == "" || returnPercent == "" || cogs == "" || date == "" )
	{
		returnDisplayError("Missing information!");
		return;
	}

	if ( returnArray.length != 0 )
	{
		returnDisplayWarning("This application does not support multiple sales yet!");
		return;
	}

	var d = new Date( date );
	d.setMinutes( d.getMinutes() + d.getTimezoneOffset() );

	if ( typeof yearArray[d.getFullYear()] == "undefined" )
	{
		var arr = [ cogs/sale, ( returnPercent / 100 ) * sale ];
		yearArray[d.getFullYear()] = arr;
	}
	else
	{
		returnDisplayWarning("This application does not support multiple sales in the same year yet!");
		return;
	}

	var entry = [ sale, date, , "Sale", groupArray.length ];
	var invEntry = [ -1 * cogs, date, , "Inventory Reduction", groupArray.length ];

	// var allowEntry = [ sale * ( returnPercent / 100 ), date, sale * ( returnPercent / 100 ), "Allowance"];
	groupArray.push(returnPercent);

	returnArray.push( entry );
	returnArray.push( invEntry );
	// returnArray.push( allowEntry );
	returnSort();

	returnUpdateTable();
}

function returnAddReturn( sale, inv, year )
{
	if ( sale == "" || inv == "" || year == "" )
	{
		returnDisplayError("Missing information!");
		return;
	}

	if ( groupArray.length == 0 )
	{
		returnDisplayError("Cannot make returns before any sales are made!");
		return;
	}

	if ( typeof yearArray[year] == "undefined" )
	{
		returnDisplayError("A sale has not yet been made for this year!");
		return;
	}

	if ( typeof yearArray[year][2] != "undefined" && oldReturn == false )
	{
		returnDisplayError("Already made a sales return for the year! Check the box if these returns are for " + year + ", but are made in " + ( parseInt(year) + 1 ));
		return;
	}

	if ( oldReturn == false )
	{
		var entry = [ sale, year + "-12-31", , "Sales Return" ];
		var invEntry = [ inv, year + "-12-31", , "Inventory Return" ];

		returnArray.push( entry );
		returnArray.push( invEntry );
		yearArray[year][2] = 1;

		var adjEntry = [ , year + "-12-31", , "Sales Return - Estimated" ];
		var adjInvEntry = [ , year + "-12-31", , "Inventory Return - Estimated" ];
		returnArray.push( adjEntry );
		returnArray.push( adjInvEntry );
	}
	else
	{
		var allowEntry = [ sale, (parseInt(year) + 1) + "-12-31", , "Allowance" ];

		returnArray.push( allowEntry );
	}
	
	returnSort();

	returnUpdateTable();
}

function returnUseFixed( year )
{
	if ( saleAmtReturn.value == "" )
	{
		returnDisplayError("Please enter the sales amount for automatic calculation!");
	}

	if ( typeof yearArray[year] == "undefined" )
		returnDisplayError("Please select the year the sale was made in!");
	else
		$("#invAmtReturn").val( yearArray[year][0] * saleAmtReturn.value );
}

function returnDisplayError( errorText )
{
    $(this).scrollTop(0);
    $("#returnErrorText").text( errorText );
    $("#returnErrorDiv").show().delay(1500).fadeOut( "slow", function() { $("#returnErrorDiv").hide(); } );
}

function returnDisplayWarning( errorText )
{
    $(this).scrollTop(0);
    $("#returnWarningText").text( errorText );
    $("#returnWarningDiv").show().delay(1500).fadeOut( "slow", function() { $("#returnWarningDiv").hide(); } );
}

function returnUpdateTable()
{
	$("#returnEntries tbody").empty();

	for ( var i = 0; i < returnArray.length; i++ )
		$("#returnEntries tbody").append('<tr><td>' + (i + 1) + '</td><td>' + accountify( returnArray[i][0], "" ) + '</td><td>' + returnArray[i][1] + '</td><td>$' + accountify( returnArray[i][2], "" ) + '</td><td>' + returnArray[i][3] + '</td></tr>');

}

function returnJEGeneration()
{
	if ( returnArray.length == 0 )
	{
		returnDisplayError("No information has been submitted!");
		return;
	}

	var JEArray = new Array();
	for ( var i = 0; i < returnArray.length; i++ )
	{
		var tempArray = new Array();
		switch( returnArray[i][3] )
		{
			case "Sale":
				tempArray.push( ["Accounts Receivable", returnArray[i][0], returnArray[i][1]] );
				tempArray.push( ["Sales Revenue", -1 * returnArray[i][0], returnArray[i][1]] );
				break;

			case "Inventory Reduction":
				tempArray.push( ["Cost of Goods Sold", -1 * parseInt( returnArray[i][0] ), returnArray[i][1]] );
				tempArray.push( ["Inventory", parseInt( returnArray[i][0] ), returnArray[i][1]] );
				break;

			case "Sales Return":
				tempArray.push( ["Sales Returns", returnArray[i][0], returnArray[i][1]] );
				tempArray.push( ["Accounts Receivable", -1 * returnArray[i][0], returnArray[i][1]] );
				break;

			case "Sales Return - Estimated":
				tempArray.push( ["Sales Returns", returnArray[i][0], returnArray[i][1]] );
				tempArray.push( ["Allowance for Sales Returns", -1 * returnArray[i][0], returnArray[i][1]] );
				break;

			case "Inventory Return":
				tempArray.push( ["Inventory", parseInt( returnArray[i][0] ), returnArray[i][1]] );
				tempArray.push( ["Cost of Goods Sold", -1 * parseInt( returnArray[i][0] ), returnArray[i][1]] );
				break;

			case "Inventory Return - Estimated":
				tempArray.push( ["Inventory - Estimated Returns", parseInt( returnArray[i][0] ), returnArray[i][1]] );
				tempArray.push( ["Cost of Goods Sold", -1 * parseInt( returnArray[i][0] ), returnArray[i][1]] );
				break;

			case "Allowance":
				tempArray.push( ["Allowance for Sales Returns", returnArray[i][0], returnArray[i][1]] );
				tempArray.push( ["Accounts Receivable", -1 * returnArray[i][0], returnArray[i][1]] );
				break;
		}

		JEArray.push( tempArray );
	}

	$("#returnContainer").html(generateJESeries( JEArray, "return" ));
}

// Bad Debts
var method = -1;
var badArray = new Array();
var debtYearArray = new Array();

function badSort()
{
	var allowance = 0;

	sorter( badArray );

	for ( var i = 0; i < badArray.length; i++ )
	{
		switch( badArray[i][3] )
		{
			case "Bad Debt Expense":
				if ( typeof badArray[i][4] == "undefined" )
				{
					// Income Statement Approach
					allowance += badArray[i][0];
				}
				else
				{
					// Balance Sheet Approach
					var difference = badArray[i][4] - allowance;
					badArray[i][0] = difference;
					allowance = badArray[i][4];
				}

				badArray[i][2] = allowance;
				break;

			case "Write-Off":
				allowance += badArray[i][0];

				badArray[i][2] = allowance;
				break;

			case "Direct Write-Off":
				badArray[i][2] = badArray[i][0];
				break;

			case "Write-Off Reversal":
				allowance += parseInt(badArray[i][0]);

				badArray[i][2] = allowance;
				break;

			case "Cash Collection":
				badArray[i][2] = parseInt(badArray[i][0]);
				break;
		}
	}

	if ( allowance < 0 )
		badArray[badArray.length - 1][5] = -1 * allowance;
}

function chooseMethod( index )
{
	switch( index )
	{
		case "":
			return;
			break;

		case "1":
			$("#incomeSection").show();
			break;

		case "2":
			$("#balanceSection").show();
			break;

		case "3":
			break;
	}
	method = parseInt(index);
	$("#methodChooser").prop('disabled', true);
}

function badAddIncExp( sales, percent, year )
{
	if ( sales == "" || percent == "" || year == "" )
	{
		badDisplayError("Missing information!");
		return;
	}

	if ( typeof debtYearArray[year] != "undefined" )
	{
		badDisplayError("Already created a bad debt expense for this year!");
		return;
	}

	debtYearArray[year] = 1;

	var entry = [ sales * (percent/100), year + "-12-31", , "Bad Debt Expense" ];

	badArray.push( entry );
	badSort();

	badUpdateTable();
}

function badAddBalExp( ending, percent, year )
{
	if ( ending == "" || percent == "" || year == "" )
	{
		badDisplayError("Missing information!");
		return;
	}

	if ( typeof debtYearArray[year] != "undefined" )
	{
		badDisplayError("Already created a bad debt expense for this year!");
		return;
	}

	debtYearArray[year] = 1;

	var entry = [ , year + "-12-31", , "Bad Debt Expense", ending * (percent/100) ];

	badArray.push( entry );
	badSort();

	badUpdateTable();
}

function badWriteOff( writeoff, date )
{
	if ( method == -1 )
	{
		badDisplayError("Please select a method first!");
		return;
	}

	if ( writeoff == "" || date == "" )
	{
		badDisplayError("Missing information!");
		return;
	}

	var entry = new Array();

	if ( method == 3 )
	{
		entry = [ -1 * writeoff, date, , "Direct Write-Off" ];
	}
	else
	{
		entry = [ -1 * writeoff, date, , "Write-Off" ];
	}

	badArray.push( entry );
	badSort();

	badUpdateTable();
}

function badUndoWriteoff( cash, date )
{
	if ( method == -1 )
	{
		badDisplayError("Please select a method first!");
		return;
	}

	if ( cash == "" || date == "" )
	{
		badDisplayError("Missing information!");
		return;
	}

	var entry = [ cash, date, , "Write-Off Reversal" ];
	var cashEntry = [ cash, date, , "Cash Collection" ];

	badArray.push( entry );
	badArray.push( cashEntry );
	badSort();

	badUpdateTable();
}

function badDisplayError( errorText )
{
    $(this).scrollTop(0);
    $("#badErrorText").text( errorText );
    $("#badErrorDiv").show().delay(1500).fadeOut( "slow", function() { $("#badErrorDiv").hide(); } );
}

function badDisplayWarning( errorText )
{
    $(this).scrollTop(0);
    $("#badWarningText").text( errorText );
    $("#badWarningDiv").show().delay(1500).fadeOut( "slow", function() { $("#badWarningDiv").hide(); } );
}

function badUpdateTable()
{
	$("#badEntries tbody").empty();

	for ( var i = 0; i < badArray.length; i++ )
		$("#badEntries tbody").append('<tr><td>' + (i + 1) + '</td><td>' + accountify( badArray[i][0], "" ) + '</td><td>' + badArray[i][1] + '</td><td>$' + accountify( badArray[i][2], "" ) + '</td><td>' + badArray[i][3] + '</td></tr>');
}

function badJEGeneration()
{
	if ( badArray.length == 0 ) 
	{
		badDisplayError("No information has been submitted!");
		return;
	}

	var JEArray = new Array();
	for ( var i = 0; i < badArray.length; i++ )
	{
		var tempArray = new Array();
		switch( badArray[i][3] )
		{
			case "Bad Debt Expense":
				tempArray.push( ["Bad Debt Expense", badArray[i][0], badArray[i][1]] );
				tempArray.push( ["Allowance for Doubtful Accounts", -1 * badArray[i][0], badArray[i][1]] );
				break;

			case "Write-Off":
				tempArray.push( ["Allowance for Doubtful Accounts", -1 * badArray[i][0], badArray[i][1]] );
				tempArray.push( ["Accounts Receivable", badArray[i][0], badArray[i][1]] );
				break;

			case "Direct Write-Off":
				tempArray.push( ["Bad Debt Expense", -1 * badArray[i][0], badArray[i][1]] );
				tempArray.push( ["Accounts Receivable", badArray[i][0], badArray[i][1]] );
				break;

			case "Write-Off Reversal":
				tempArray.push( ["Accounts Receivable", badArray[i][0], badArray[i][1]] );

				if ( method != 3 )
					tempArray.push( ["Allowance for Doubtful Accounts", -1 * badArray[i][0], badArray[i][1]] );
				else
					tempArray.push( ["Bad Debt Expense", -1 * badArray[i][0], badArray[i][1]] );
				break;

			case "Cash Collection":
				tempArray.push( ["Cash", badArray[i][0], badArray[i][1]] );
				tempArray.push( ["Accounts Receivable", -1 * badArray[i][0], badArray[i][1]] );
				break;
		}

		JEArray.push( tempArray );
	}

	$("#badContainer").html( generateJESeries( JEArray, "bad" ));

	if ( typeof badArray[badArray.length - 1][5] != "undefined" || method == 3 )
	{
		$("#badPermWarningDiv").html('<div class="alert alert-warning alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button><strong>Warning:</strong> <span id="badPermWarningText">This is text that should be replaced</span></div>');
		if ( method == 3 )
			$("#badPermWarningText").text( "The direct write-off method is NOT supported by GAAP; use only if doubtful accounts cannot be properly estimated!") ;
		else	
			$("#badPermWarningText").text( "Write-offs exceeded the allowance by $" + accountify( badArray[badArray.length - 1][5], "" ) + "!") ;
	}
	else
	{
		$("#badPermWarningDiv").html('');
	}
}