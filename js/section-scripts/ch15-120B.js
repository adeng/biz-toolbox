$(document).ready( function() {
	$("#costsOp").tooltip({ container: 'body' });
	$("#rateCap").tooltip({ container: 'body' });
	$("#autoAsset").tooltip({ container: 'body' });
	$("#lifeCap").tooltip({ container: 'body' });
	$("#valueLback").tooltip({ container: 'body' });
	$("#directDirect").tooltip({ container: 'body' });
	$("#directSale").tooltip({ container: 'body' });
});

// Operating Leases

var isLessor = false;
var opArray = new Array();

function opSort()
{
	// sorter( opArray );
	var prepaidBalance = 0;
	var directCosts = 0;

	for ( var i = 0; i < opArray.length; i++ )
	{
		switch( opArray[i][3] )
		{
			case "Rent Payment":
				prepaidBalance += parseInt(opArray[i][0]);
				opArray[i][2] = prepaidBalance;
				break;

			case "Rent Expense":
				prepaidBalance -= parseInt(opArray[i][0]);
				opArray[i][2] = prepaidBalance;
				break;

			case "Rent Received":
				prepaidBalance -= parseInt(opArray[i][0]);
				opArray[i][2] = prepaidBalance;
				break;	

			case "Rent Revenue":
				prepaidBalance -= parseInt(opArray[i][0]);
				opArray[i][2] = prepaidBalance;
				break;

			case "Initial Direct Costs":
				directCosts += parseInt(opArray[i][0]);
				opArray[i][2] = directCosts;
				break;

			case "Cost Amortization":
				directCosts += parseInt(opArray[i][0]);
				opArray[i][2] = directCosts;
				break;

			case "Depreciation":
				break;
		}
	}
}

function opAddLeaseLessee( amount, payments, issue, year )
{ 
	if ( amount == "" || payments == "" || issue == "" )
	{
		opDisplayError("Missing information!");
		return;
	}

	opArray.length = 0;
	for ( var i = 0; i < payments; i++ )
	{
		var currYear = ( parseInt(year) + i );

		var realizeYear = ( issue == "beg" ) ? currYear : currYear + 1;

		var issueDate = ( issue == "beg" ) ? "-01-01" : "-12-31";

		opArray.push( [ amount, currYear + issueDate, , "Rent Payment" ] );
		opArray.push( [ amount, realizeYear + "-12-31", , "Rent Expense" ] );
	}

	opSort();

	opUpdateTable();
}

function opAddLeaseLessor( amount, payments, issue, year, asset, life, costs )
{
	if ( amount == "" || payments == "" || issue == "" || asset == "" || life == "" )
	{
		opDisplayError("Missing information!");
		return;
	}

	opArray.length = 0;

	if ( costs != 0 ) 
	{
		var str = ( issue == "beg" ) ? "-01-01" : "-12-31";
		opArray.push( [ costs, year + str, costs, "Initial Direct Costs" ]);
	}

	for ( var i = 0; i < payments; i++ )
	{
		var currYear = ( parseInt(year) + i );
		var realizeYear = ( issue == "beg" ) ? currYear : currYear + 1;
		var issueDate = ( issue == "beg" ) ? "-01-01" : "-12-31";

		opArray.push( [ amount, currYear + issueDate, , "Rent Received" ] );
		opArray.push( [ -1 * amount, realizeYear + "-12-31", , "Rent Revenue" ] );
		opArray.push( [ -1 * Math.round( asset / life ), realizeYear + "-12-31", asset - (( asset / life ) * i), "Depreciation" ] );
		if ( costs != 0 )
			opArray.push( [ -1 * Math.round( costs / payments ), realizeYear + "-12-31", , "Cost Amortization" ] );
	}
	opSort();

	opUpdateTable();
}

function opUpdateTable()
{
	$("#opEntries tbody").empty();

	for ( var i = 0; i < opArray.length; i++ )
		$("#opEntries tbody").append('<tr><td>' + (i + 1) + '</td><td>' + accountify( opArray[i][0], "" ) + '</td><td>' + opArray[i][1] + '</td><td>$' + accountify( opArray[i][2], "" ) + '</td><td>' + opArray[i][3] + '</td></tr>');

}

function opDisplayError( errorText )
{
    $(this).scrollTop(0);
    $("#opErrorText").text( errorText );
    $("#opErrorDiv").show().delay(1500).fadeOut( "slow", function() { $("#opErrorDiv").hide(); } );
}

function opDisplayWarning( errorText )
{
    $(this).scrollTop(0);
    $("#opWarningText").text( errorText );
    $("#opWarningDiv").show().delay(1500).fadeOut( "slow", function() { $("#opWarningDiv").hide(); } );
}

function opJEGeneration()
{
	if ( opArray.length == 0 )
	{
		opDisplayError("No information has been submitted!");
	}

	var JEArray = new Array();
	for ( var i = 0; i < opArray.length; i++ )
	{
		var tempArray = new Array();
		switch( opArray[i][3] )
		{
			case "Rent Payment":
				tempArray.push( ["Prepaid Rent", opArray[i][0], opArray[i][1]] );
				tempArray.push( ["Cash", -1 * opArray[i][0], opArray[i][1]] );
				break;

			case "Rent Expense":
				tempArray.push( ["Rent Expense", opArray[i][0], opArray[i][1]] );
				tempArray.push( ["Prepaid Rent", -1 * opArray[i][0], opArray[i][1]] );
				break;

			case "Rent Received":
				tempArray.push( ["Cash", opArray[i][0], opArray[i][1]] );
				tempArray.push( ["Unearned Rent Revenue", -1 * opArray[i][0], opArray[i][1]] );
				break;

			case "Rent Revenue":
				tempArray.push( ["Unearned Rent Revenue", -1 * opArray[i][0], opArray[i][1]] );
				tempArray.push( ["Rent Revenue", opArray[i][0], opArray[i][1]] );
				break;

			case "Initial Direct Costs":
				tempArray.push( ["Deferred Initial Direct Costs", opArray[i][0], opArray[i][1]] );
				tempArray.push( ["Cash", -1 * opArray[i][0], opArray[i][1]] );
				break;

			case "Cost Amortization":
				tempArray.push( ["Lease Expense", -1 * opArray[i][0], opArray[i][1]] );
				tempArray.push( ["Deferred Initial Direct Costs", opArray[i][0], opArray[i][1]] );
				break;

			case "Depreciation":
				tempArray.push( ["Depreciation Expense", -1 * opArray[i][0], opArray[i][1]] );
				tempArray.push( ["Accumulated Depreciation", opArray[i][0], opArray[i][1]] );
				break;
		}

		JEArray.push( tempArray );
	}

	$("#opContainer").html(generateJESeries( JEArray, "op" ));
}

// Capital Leases - Lessee 

var capArray = new Array();
var chosen = "";
var capBPO = false;
var autoCap = true;

function capSort()
{
	// sorter( capArray );
	var leaseBalance = 0;

	for ( var i = 0; i < capArray.length; i++ )
	{
		switch( capArray[i][3] )
		{
			case "Lease Inception":
				leaseBalance += capArray[i][0];
				break;

			case "Lease Payment":
				leaseBalance += capArray[i][0];
				capArray[i][2] = leaseBalance;
				break;

			case "Depreciation":
				break;
		}
	}
}

function capDisabler()
{
	if ( autoCap )
	{
		if ( rateCap.value == "" || numCap.value == "" )
		{
			$("#payCap").prop('disabled', true );
			$("#valueCap").prop('disabled', true );
		}
		else
		{
			if ( chosen == "" )
			{
				if ( payCap.value == "" && valueCap.value == "" )
				{
					$("#payCap").prop('disabled', false );
					$("#valueCap").prop('disabled', false );	
				}
				else if ( payCap.value != "" && valueCap.value == "" )
				{
					$("#valueCap").prop('disabled', true );
					!capBPO ? $("#valueCap").val( Math.round( calcAssetValue( payCap.value, rateCap.value, numCap.value, 0, ordinaryCap.value == "false")) ) : $("#valueCap").val( Math.round( calcAssetValue( payCap.value, rateCap.value, numCap.value, parseInt( bpoCap.value ), ordinaryCap.value == "false")) );
					chosen = "value";
				}
				else if ( payCap.value == "" && valueCap.value != "" )
				{
					$("#payCap").prop('disabled', true );
					!capBPO ? $("#payCap").val( Math.round(calcPaymentValue( valueCap.value, rateCap.value, numCap.value, 0, ordinaryCap.value == "false")) ) : $("#payCap").val( Math.round(calcPaymentValue( valueCap.value, rateCap.value, numCap.value, parseInt( bpoCap.value ), ordinaryCap.value == "false")) );
					chosen = "pay";
				}
			}
			else
			{
				if ( payCap.value == "" )
				{
					chosen = "";
					$("#valueCap").prop('disabled', false);
					$("#valueCap").val("");
				}
				else if ( valueCap.value == "" )
				{
					chosen = "";
					$("#payCap").prop('disabled', false);
					$("#payCap").val("");
				}
				else if ( chosen == "pay" ) 
				{
					$("#payCap").prop('disabled', true );
					!capBPO ? $("#payCap").val( Math.round(calcPaymentValue( valueCap.value, rateCap.value, numCap.value, 0, ordinaryCap.value == "false")) ) : $("#payCap").val( Math.round(calcPaymentValue( valueCap.value, rateCap.value, numCap.value, parseInt( bpoCap.value ), ordinaryCap.value == "false")) );
				}
				else if ( chosen == "value" ) 
				{
					$("#valueCap").prop('disabled', true );
					!capBPO ? $("#valueCap").val( Math.round( calcAssetValue( payCap.value, rateCap.value, numCap.value, 0, ordinaryCap.value == "false")) ) : $("#valueCap").val( Math.round( calcAssetValue( payCap.value, rateCap.value, numCap.value, parseInt( bpoCap.value ), ordinaryCap.value == "false")) );
				}
			}
		}
	}
	else
	{
		$("#payCap").prop('disabled', false );
		$("#valueCap").prop('disabled', false );
	}
}

function checkIfCapitalLease( num, rate, pmt, amt, ordinary, life, issueDate, year, bpo )
{
	if ( num == "" || rate == "" || pmt == "" || amt == "" || life == "" || ( capBPO && bpo == "" ))
	{
		capDisplayError("Missing information!");
		return;
	}

	if ( capBPO || num >= 0.75 * life || calcAssetValue( pmt, num, rate, bpo, ordinary ) >= 0.9 * amt )
	{
		capBPO ? capAddLease( num, rate, pmt, amt, ordinary, life, issueDate, year, bpo, ordinary ) : capAddLease( num, rate, pmt, amt, ordinary, life, issueDate, year, "", ordinary );
	}
	else
	{
		bootbox.dialog({
			message: "Warning! Unless ownership of the asset is explicitly transferred to the lessee after the lease term, this is NOT considered a capital lease. Does ownership transfer?",
			title: "Warning!",
			buttons: {
				danger: {
					label: "No",
					classname: "btn-danger",
					callback: function() {
						capDisplayError("This is not a capital lease! Please refer to the operating lease section.");
						return;
					}
				},
				success: {
					label: "Yes",
					classname: "btn-success",
					callback: function() {
						 capBPO ? capAddLease( num, rate, pmt, amt, ordinary, life, issueDate, year, bpo, ordinary ) : capAddLease( num, rate, pmt, amt, ordinary, life, issueDate, year, "", ordinary );
					}
				}
			}
		});
	}
	
}

function capAddLease( num, rate, pmt, amt, ordinary, life, issueDate, year, bpo )
{
	capArray.length = 0;
	var newEntries = new Array();

	var issueString = ( issueDate == "beg" ) ? "-01-01" : "-12-31";
	var d = new Date( year + issueString );

	newEntries = amortCapitalLease( rate, year + issueString, num, "cap", pmt, capBPO ? bpo : "", ordinary );

	capArray.push( [ newEntries[0][1], newEntries[0][0], newEntries[0][1], "Lease Inception" ] );

	for ( var i = 1; i < newEntries.length; i++ )
	{
		capArray.push( [ newEntries[i][2], newEntries[i][3], , "Lease Payment", newEntries[i][0], newEntries[i][1]] );
		if ( ordinary || i > 1 )
			capArray.push( [ Math.round(amt/life), newEntries[i][3], amt - Math.round((i * (amt/life))), "Depreciation" ] );
	}

/*
	if ( ordinary || i > 1 ) 
	{
		var e = new Date( newEntries[newEntries.length - 1][3] );
		e.setMinutes( e.getMinutes() + e.getTimezoneOffset() );
		e.setFullYear( e.getFullYear() + 1 );

		capArray.push( [ Math.round(amt/life), e.getFullYear() + "-12-31", amt - Math.round((newEntries.length * (amt/life))), "Depreciation" ] );
	} */
			
	capSort();
}

function capDisplayError( errorText )
{
    $(this).scrollTop(0);
    $("#capErrorText").text( errorText );
    $("#capErrorDiv").show().delay(1500).fadeOut( "slow", function() { $("#capErrorDiv").hide(); } );
}

function capDisplayWarning( errorText )
{
    $(this).scrollTop(0);
    $("#capWarningText").text( errorText );
    $("#capWarningDiv").show().delay(1500).fadeOut( "slow", function() { $("#capWarningDiv").hide(); } );
}

function capJEGeneration()
{
	if ( capArray.length == 0 )
	{
		capDisplayError("No information has been submitted!");
		return;
	}

	var JEArray = new Array();
	for ( var i = 0; i < capArray.length; i++ )
	{
		var tempArray = new Array();
		switch( capArray[i][3] )
		{
			case "Lease Inception":
				tempArray.push( ["Leased Equipment", capArray[i][0], capArray[i][1]] );
				tempArray.push( ["Lease Payable", -1 * capArray[i][0], capArray[i][1]] );
				break;

			case "Lease Payment":
				tempArray.push( ["Lease Payable", -1 * capArray[i][0], capArray[i][1]] );
				if ( capArray[i][5] != 0 )
					tempArray.push( ["Interest Expense", capArray[i][5], capArray[i][1]] );
				tempArray.push( ["Cash", -1 * capArray[i][4], capArray[i][1]] );
				break;

			case "Depreciation":
				tempArray.push( ["Depreciation Expense", capArray[i][0], capArray[i][1]] );
				tempArray.push( ["Accumulated Depreciation", -1 * capArray[i][0], capArray[i][1]] );
				break;
		}

		JEArray.push( tempArray );
	}

	$("#capContainer").html(generateJESeries( JEArray, "cap" ));
}

// Sale-Leaseback Lease

var lbackArray = new Array();

function lbackSort()
{
	// sorter( lbackArray );
	var leaseBalance = 0;

	for ( var i = 0; i < lbackArray.length; i++ )
	{
		switch( lbackArray[i][3] )
		{
			case "Lease Inception":
				leaseBalance = lbackArray[i][0];
				break;

			case "Lease Payment":
				leaseBalance += lbackArray[i][0];
				lbackArray[i][2] = leaseBalance;
				break;
		}
	}
}

function lbackAddLease( num, rate, amt, depr, sale, life, issueDate, year )
{
	if ( num == "" || rate == "" || amt == "" || depr == "" || sale == "" || life == "" )
	{
		lbackDisplayError("Missing information!");
		return;
	}

	lbackArray.length = 0; 
	var newEntries = new Array();

	var issueString = ( issueDate == "beg" ) ? "-01-01" : "-12-31";
	var d = new Date( year + issueString );

	newEntries = amortCapitalLease( rate, year + issueString, num, "lback", calcPaymentValue( sale, rate, num, 0, false ), 0, false );

	lbackArray.push( [ newEntries[0][1], newEntries[0][0], newEntries[0][1], "Lease Inception", sale - ( amt - depr ), amt, depr ] );

	for ( var i = 1; i < newEntries.length; i++ )
	{
		lbackArray.push( [ newEntries[i][2], newEntries[i][3], , "Lease Payment", newEntries[i][0], newEntries[i][1]] );
		if ( i > 1 ) 
		{
			lbackArray.push( [ Math.round(sale/life), newEntries[i][3], amt - Math.round((i * (amt/life))), "Depreciation" ] );
			if ( sale - ( amt - depr ) > 0 )
				lbackArray.push( [ Math.round( (sale - ( amt - depr )) / num ), newEntries[i][3], sale - ( amt - depr ) - Math.round(( i * ((sale - ( amt - depr )) / num ))), "Deferred Gain Amortization" ] );
		}
	}

	lbackSort();
}

function lbackDisplayError( errorText )
{
    $(this).scrollTop(0);
    $("#lbackErrorText").text( errorText );
    $("#lbackErrorDiv").show().delay(1500).fadeOut( "slow", function() { $("#lbackErrorDiv").hide(); } );
}

function lbackDisplayWarning( errorText )
{
    $(this).scrollTop(0);
    $("#lbackWarningText").text( errorText );
    $("#lbackWarningDiv").show().delay(1500).fadeOut( "slow", function() { $("#lbackWarningDiv").hide(); } );
}

function lbackJEGeneration()
{
	if ( lbackArray.length == 0 )
	{
		lbackDisplayError("No information has been submitted!");
		return;
	}

	var JEArray = new Array();
	for ( var i = 0; i < lbackArray.length; i++ )
	{
		var tempArray = new Array();
		switch( lbackArray[i][3] )
		{
			case "Lease Inception":
				tempArray.push( ["Cash", lbackArray[i][0], lbackArray[i][1]] );
				tempArray.push( ["Accumulated Depreciation", lbackArray[i][6], lbackArray[i][1]] );
				tempArray.push( ["Equipment", -1 * lbackArray[i][5], lbackArray[i][1]] );
				if ( lbackArray[i][4] != 0 )
					tempArray.push( [ ( lbackArray[i][4] > 0 ) ? "Deferred Gain on Sale-Leaseback" : "Loss on Sale", -1 * lbackArray[i][4], lbackArray[i][1]] );
				break;

			case "Lease Payment":
				tempArray.push( ["Lease Payable", -1 * lbackArray[i][0], lbackArray[i][1]] );
				if ( lbackArray[i][5] != 0 )
					tempArray.push( ["Interest Expense", lbackArray[i][5], lbackArray[i][1]] );
				tempArray.push( ["Cash", -1 * lbackArray[i][4], lbackArray[i][1]] );
				break;


			case "Depreciation":
				tempArray.push( ["Depreciation Expense", lbackArray[i][0], lbackArray[i][1]] );
				tempArray.push( ["Accumulated Depreciation", -1 * lbackArray[i][0], lbackArray[i][1]] );
				break; 

			case "Deferred Gain Amortization":
				tempArray.push( ["Deferred Gain on Sale-Leaseback", lbackArray[i][0], lbackArray[i][1]] );
				tempArray.push( ["Depreciation Expense", -1 * lbackArray[i][0], lbackArray[i][1]] );
				break;
		}

		JEArray.push( tempArray );
	}

	$("#lbackContainer").html(generateJESeries( JEArray, "lback" ));
}

// Direct-Financing Lease

var directArray = new Array();
var directBPO = false;
var chosenDirect = "";

function directSort()
{
	// sorter( directArray );
	var leaseBalance = 0;

	for ( var i = 0; i < directArray.length; i++ )
	{
		switch( directArray[i][3] )
		{
			case "Lease Inception":
				leaseBalance = directArray[i][0];
				break;

			case "Lease Revenue":
				leaseBalance += directArray[i][0];
				directArray[i][2] = leaseBalance;
				break;

			case "Initial Direct Costs":
				leaseBalance += directArray[i][0];
				break;
		}
	}
}

function directAddLease( num, rate, pmt, amt, ordinary, issueDate, year, bpo, direct )
{
	if ( num == "" || rate == "" || pmt == "" || amt == "" || ( directBPO && bpo == "") || direct == "" )
	{
		directDisplayError("Missing information!");
		return;
	}

	directArray.length = 0; 
	var newEntries = new Array();

	var issueString = ( issueDate == "beg" ) ? "-01-01" : "-12-31";
	var d = new Date( year + issueString );

	newEntries = amortCapitalLease( ordinary ? calcPVARate( rate, num, (parseInt(amt) + parseInt(direct))/pmt ) : calcPVADRate( rate, num, (parseInt(amt) + parseInt(direct))/pmt ), year + issueString, num, "direct", pmt, directBPO ? bpo : "", ordinary, direct );
	console.log( calcPVARate( rate, num, (parseInt(amt) + parseInt(direct))/pmt ));

	directArray.push( [ amt, newEntries[0][0], newEntries[0][1], "Lease Inception" ] );
	if ( direct != 0 )
		directArray.push( [ direct, newEntries[0][0], , "Initial Direct Costs"]);

	for ( var i = 1; i < newEntries.length; i++ )
	{
		directArray.push( [ newEntries[i][2], newEntries[i][3], , "Lease Revenue", newEntries[i][0], newEntries[i][1]] );
	}

	directSort();
}

function directDisabler()
{
	if ( rateDirect.value == "" || numDirect.value == "" )
	{
		$("#payDirect").prop('disabled', true );
		$("#valueDirect").prop('disabled', true );
	}
	else
	{
		if ( chosenDirect == "" )
		{
			if ( payDirect.value == "" && valueDirect.value == "" )
			{
				$("#payDirect").prop('disabled', false );
				$("#valueDirect").prop('disabled', false );	
			}
			else if ( payDirect.value != "" && valueDirect.value == "" )
			{
				$("#valueDirect").prop('disabled', true );
				!directBPO ? $("#valueDirect").val( Math.round( calcAssetValue( payDirect.value, rateDirect.value, numDirect.value, 0, ordinaryDirect.value == "false")) ) : $("#valueDirect").val( Math.round( calcAssetValue( payDirect.value, rateDirect.value, numDirect.value, parseInt( bpoDirect.value ), ordinaryDirect.value == "false")) );
				chosenDirect = "value";
			}
			else if ( payDirect.value == "" && valueDirect.value != "" )
			{
				$("#payDirect").prop('disabled', true );
				!directBPO ? $("#payDirect").val( Math.round(calcPaymentValue( valueDirect.value, rateDirect.value, numDirect.value, 0, ordinaryDirect.value == "false")) ) : $("#payDirect").val( Math.round(calcPaymentValue( valueDirect.value, rateDirect.value, numDirect.value, parseInt( bpoDirect.value ), ordinaryDirect.value == "false")) );
				chosenDirect = "pay";
			}
		}
		else
		{
			if ( payDirect.value == "" )
			{
				chosenDirect = "";
				$("#valueDirect").prop('disabled', false);
				$("#valueDirect").val("");
			}
			else if ( valueDirect.value == "" )
			{
				chosenDirect = "";
				$("#payDirect").prop('disabled', false);
				$("#payDirect").val("");
			}
			else if ( chosenDirect == "pay" ) 
			{
				$("#payDirect").prop('disabled', true );
				!directBPO ? $("#payDirect").val( Math.round(calcPaymentValue( valueDirect.value, rateDirect.value, numDirect.value, 0, ordinaryDirect.value == "false")) ) : $("#payDirect").val( Math.round(calcPaymentValue( valueDirect.value, rateDirect.value, numDirect.value, parseInt( bpoDirect.value ), ordinaryDirect.value == "false")) );
			}
			else if ( chosenDirect == "value" ) 
			{
				$("#valueDirect").prop('disabled', true );
				!directBPO ? $("#valueDirect").val( Math.round( calcAssetValue( payDirect.value, rateDirect.value, numDirect.value, 0, ordinaryDirect.value == "false")) ) : $("#valueDirect").val( Math.round( calcAssetValue( payDirect.value, rateDirect.value, numDirect.value, parseInt( bpoDirect.value ), ordinaryDirect.value == "false")) );
			}
		}
	}
}

function directDisplayError( errorText )
{
    $(this).scrollTop(0);
    $("#directErrorText").text( errorText );
    $("#directErrorDiv").show().delay(1500).fadeOut( "slow", function() { $("#directErrorDiv").hide(); } );
}

function directDisplayWarning( errorText )
{
    $(this).scrollTop(0);
    $("#directWarningText").text( errorText );
    $("#directWarningDiv").show().delay(1500).fadeOut( "slow", function() { $("#directWarningDiv").hide(); } );
}

function directJEGeneration()
{
	if ( directArray.length == 0 )
	{
		directDisplaError("No information has been submitted!");
		return;
	}

	var JEArray = new Array();
	for ( var i = 0; i < directArray.length; i++ )
	{
		var tempArray = new Array();
		switch( directArray[i][3] )
		{
			case "Lease Inception":
				tempArray.push( ["Lease Receivable", directArray[i][0], directArray[i][1]] );
				tempArray.push( ["Inventory of Equipment", -1 * directArray[i][0], directArray[i][1]] );
				break;

			case "Lease Revenue":
				tempArray.push( ["Lease Receivable", directArray[i][0], directArray[i][1]] );
				if ( directArray[i][5] != 0 )
					tempArray.push( ["Interest Expense", -1 * directArray[i][5], directArray[i][1]] );
				tempArray.push( ["Cash", directArray[i][4], directArray[i][1]] );
				break;

			case "Initial Direct Costs":
				tempArray.push( [ "Lease Receivable", directArray[i][0], directArray[i][1]] );
				tempArray.push( [ "Cash", -1 * directArray[i][0], directArray[i][1]] );
				break;
		}

		JEArray.push( tempArray );
	}

	$("#directContainer").html(generateJESeries( JEArray, "direct" ));
}

// Sales-Type Leases

var saleBPO = false;
var saleArray = new Array();

function saleSort()
{
	// sorter( saleArray );
	var leaseBalance = 0;

	for ( var i = 0; i < saleArray.length; i++ )
	{
		switch( saleArray[i][3] )
		{
			case "Lease Inception":
				leaseBalance = saleArray[i][0];
				break;

			case "Lease Revenue":
				leaseBalance += saleArray[i][0];
				saleArray[i][2] = leaseBalance;
				break;
		}
	}
}

function saleAddLease( num, rate, pmt, amt, ordinary, issueDate, year, bpo, direct )
{
	if ( num == "" || rate == "" || pmt == "" || amt == "" || ( saleBPO && bpo == "") || direct == "" )
	{
		saleDisplayError("Missing information!");
		return;
	}

	saleArray.length = 0; 
	var newEntries = new Array();

	var issueString = ( issueDate == "beg" ) ? "-01-01" : "-12-31";
	var d = new Date( year + issueString );

	newEntries = amortCapitalLease( rate, year + issueString, num, "sale", pmt, saleBPO ? bpo : "", ordinary, direct );
	saleArray.push( [ newEntries[0][1], newEntries[0][0], newEntries[0][1], "Lease Inception", amt ] );

	if ( direct != 0 )
		saleArray.push( [ direct, newEntries[0][0], , "Initial Direct Costs"]);

	for ( var i = 1; i < newEntries.length; i++ )
	{
		saleArray.push( [ newEntries[i][2], newEntries[i][3], , "Lease Revenue", newEntries[i][0], newEntries[i][1]] );
	}

	saleSort();
}

function saleDisplayError( errorText )
{
    $(this).scrollTop(0);
    $("#saleErrorText").text( errorText );
    $("#saleErrorDiv").show().delay(1500).fadeOut( "slow", function() { $("#saleErrorDiv").hide(); } );
}

function saleDisplayWarning( errorText )
{
    $(this).scrollTop(0);
    $("#saleWarningText").text( errorText );
    $("#saleWarningDiv").show().delay(1500).fadeOut( "slow", function() { $("#saleWarningDiv").hide(); } );
}

function saleJEGeneration()
{
	if ( saleArray.length == 0 )
	{
		saleDisplayError("No information has been submitted!");
		return;
	}

	var JEArray = new Array();
	for ( var i = 0; i < saleArray.length; i++ )
	{
		var tempArray = new Array();
		switch( saleArray[i][3] )
		{
			case "Lease Inception":
				tempArray.push( ["Lease Receivable", saleArray[i][0], saleArray[i][1]] );
				tempArray.push( ["Cost of Goods Sold", saleArray[i][4], saleArray[i][1]] );
				tempArray.push( ["Inventory of Equipment", -1 * saleArray[i][4], saleArray[i][1]] );
				tempArray.push( ["Sales Revenue", -1 * saleArray[i][0], saleArray[i][1]] );
				break;

			case "Lease Revenue":
				tempArray.push( ["Lease Receivable", saleArray[i][0], saleArray[i][1]] );
				if ( saleArray[i][5] != 0 )
					tempArray.push( ["Interest Expense", -1 * saleArray[i][5], saleArray[i][1]] );
				tempArray.push( ["Cash", saleArray[i][4], saleArray[i][1]] );
				break;

			case "Initial Direct Costs":
				tempArray.push( [ "Selling Expense", saleArray[i][0], saleArray[i][1]] );
				tempArray.push( [ "Cash", -1 * saleArray[i][0], saleArray[i][1]] );
				break;
		}

		JEArray.push( tempArray );
	}

	$("#saleContainer").html(generateJESeries( JEArray, "sale" ));
}


// Helper Functions

function amortCapitalLease( intRate, date, periods, table, payments, bpo, ordinary, direct )
{
	var initialCarry;
	if ( !ordinary )
		initialCarry = ( typeof bpo == "undefined" || bpo == "" || isNaN(bpo) ) ? presentValueAnnuityDue( payments, intRate, periods ) : presentValueAnnuityDue( payments, intRate, periods ) + presentValue( bpo, intRate, periods );
	else
		initialCarry = ( typeof bpo == "undefined" || bpo == "" || isNaN(bpo) ) ? presentValueAnnuity( payments, intRate, periods ) : presentValueAnnuity( payments, intRate, periods ) + presentValue( bpo, intRate, periods + 1 );

	if ( typeof direct != "undefined" && direct != "" && !isNaN(direct) )
		initialCarry += direct;

	var errorTolerance = 10;
	var counter = 1;

	var compArray = new Array();

	$("#" + table + "Table tbody").empty();
	$("#" + table + "Table tbody").append('<tr><td>' + date + '</td><td></td><td></td><td></td><td>' + accountify( Math.round( initialCarry ), "" ) + '</td></tr>');

	var f = new Date( date );
	f.setMinutes( f.getMinutes() + f.getTimezoneOffset());
	f.setFullYear( f.getFullYear() + periods);
	if ( f.getMonth() == 0 )
		f.setDate( f.getDate() - 1 );

	compArray.push( [date, Math.round( initialCarry ), , f.getFullYear() + "-" + ( parseInt( f.getMonth() ) + 1 ) + "-" + f.getDate()] );

	if ( !ordinary )
	{
		initialCarry = Math.round( initialCarry - payments);
		compArray.push( [Math.round( payments ), 0, Math.round( -1 * payments ), date, initialCarry ] );
		$("#" + table + "Table tbody").append('<tr><td>' + date + '</td><td>' + accountify( Math.round(payments), "" ) + '</td><td></td><td></td><td>' + accountify( initialCarry, "" ) + '</td></tr>');
	}

	var numPer = !( typeof bpo == "undefined" || bpo == "" || isNaN(bpo) ) ? parseInt(periods) + 1 : periods;
	if ( ordinary )
		numPer++;

	console.log( initialCarry );
	
	while ( counter < numPer )
	{
		var cash = ( !( typeof bpo == "undefined" || bpo == "" || isNaN(bpo) ) && counter == periods ) ? Math.round(bpo) : Math.round(payments);
		var interest;
		var principal;

		interest = parseFloat( Math.round( calcInt( initialCarry, intRate, 12 )));
		principal = ( !( typeof bpo == "undefined" || bpo == "" || isNaN(bpo) ) && counter == numPer ) ? interest - bpo : interest - cash;
				
		initialCarry = Math.round( principal + parseInt( initialCarry ));	
		if ( counter == numPer - 1 && Math.abs( 0 - initialCarry) < errorTolerance ) 
		{
			interest += 0 - initialCarry;
			principal += 0 - initialCarry;
			initialCarry = 0;
		}
		var d = new Date( date );
		d.setMinutes( d.getMinutes() + d.getTimezoneOffset() );
		d.setMonth( d.getMonth() + ( 12 * counter ));

		if ( d.getMonth() == 0 )
			d.setDate( d.getDate() - 1 );

		compArray.push( [ cash, interest, principal, d.getFullYear() + "-" + ( parseInt( d.getMonth() ) + 1 ) + "-" + d.getDate(), initialCarry ] );
		$("#" + table + "Table tbody").append('<tr><td>' + d.getFullYear() + "-" + ( parseInt( d.getMonth() ) + 1 ) + "-" + d.getDate() + '</td><td>' + accountify( cash, "" ) + '</td><td>' + accountify( interest, "" ) + '</td><td>' + accountify( principal, "" ) + '</td><td>' + accountify( initialCarry, "" ) + '</td></tr>');

		counter++;
	}

	return compArray;
}