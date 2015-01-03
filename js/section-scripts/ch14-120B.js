$(document).ready( function() { 
	$("#perBond").tooltip({ container: 'body' });
	$("#warNumWarrant").tooltip({ container: 'body' });
	$("#exerWarrant").tooltip({ container: 'body' });
	$("#warMktWarrant").tooltip({ container: 'body' });
});

// Ordinary Bonds

var bondArray = new Array();

var bondChoice = "issuer";

function bondSort()
{
	// sorter( bondArray );
	var carryingValue = 0;

	for ( var i = 0; i < bondArray.length; i++ )
	{
		switch( bondArray[i][3] )
		{
			case "Issue":
				carryingValue = bondArray[i][2];
				break;

			case "Interest Revenue":
				carryingValue += bondArray[i][0];
				break;

			case "Retirement":
				break;
		}

		bondArray[i][2] = carryingValue;
	}
}

function bondAddBond( face, mktRate, noteRate, issueDate, periods, method, effective, fiscal, choice )
{
	bondArray.length = 0;
	var newEntries = new Array();
	var newEntries = new Array();
	if ( face == "" || mktRate == "" || noteRate == "" || issueDate == "" || periods == "" || fiscal == "" )
	{
		bondDisplayError("Missing information!");
		return;
	}

	bondChoice = choice;

	var d = new Date( issueDate );
	d.setMinutes( d.getMinutes() + d.getTimezoneOffset() );

	(isDefault( fiscal ) && isOriginal( issueDate )) ? newEntries = amortTableUpdate( face, mktRate, noteRate, method, issueDate, periods, effective, "bond" ) : newEntries = amortMidQuarterUpdate( face, mktRate, noteRate, method, issueDate, periods, effective, "bond", fiscal );

	bondArray.push( [newEntries[0][1], newEntries[0][0], newEntries[0][1], "Issue", newEntries[0][2]]);

	for ( var i = 1; i < newEntries.length; i++ )
	{
		bondArray.push( [newEntries[i][2], newEntries[i][3], , "Interest Revenue", newEntries[i][0], newEntries[i][1]] );
	}

	bondArray.push( [newEntries[0][2], newEntries[0][3], 0, "Retirement" ] );

	bondSort();
}

function bondDisplayError( errorText )
{
    $(this).scrollTop(0);
    $("#bondErrorText").text( errorText );
    $("#bondErrorDiv").show().delay(1500).fadeOut( "slow", function() { $("#bondErrorDiv").hide(); } );
}

function bondDisplayWarning( errorText )
{
    $(this).scrollTop(0);
    $("#bondWarningText").text( errorText );
    $("#bondWarningDiv").show().delay(1500).fadeOut( "slow", function() { $("#bondWarningDiv").hide(); } );
}

function bondJEGeneration()
{
	if ( bondArray.length == 0 )
	{
		interestDisplayError("No information has been submitted!");
		return;
	}

	var JEArray = new Array();
	for ( var i = 0; i < bondArray.length; i++ )
	{
		var tempArray = new Array();

		if ( bondChoice == "issuer" )
		{
			switch( bondArray[i][3] )
			{
				case "Issue":
					var diff = bondArray[i][4] - bondArray[i][0];
					tempArray.push( ["Cash", bondArray[i][0], bondArray[i][1]] );
					if ( diff != 0 )
						tempArray.push( [ ( diff > 0 ) ? "Discount on Bonds" : "Premium on Bonds", diff, bondArray[i][1]] );
					tempArray.push( ["Bonds Payable", -1 * bondArray[i][4], bondArray[i][1]] );
					break;

				case "Interest Revenue":
					tempArray.push( ["Interest Expense", bondArray[i][5], bondArray[i][1]] );
					if ( bondArray[i][0] != 0 )
						tempArray.push( [ ( bondArray[i][0] > 0 ) ? "Discount on Bonds" : "Premium on Bonds" , -1 * bondArray[i][0], bondArray[i][1]] );

					if ( bondArray[i][4] != 0 ) 
					{
						tempArray.push( ["Cash", -1 * bondArray[i][4], bondArray[i][1]] );
						if ( bondArray[i][4] + bondArray[i][0] != bondArray[i][5] )
						{
							var receivable = bondArray[i][5] - ( bondArray[i][4] + bondArray[i][0] );
							tempArray.push( ["Interest Payable", -1 * receivable, bondArray[i][1]] );
						}
					}
					else 
					{
						var diff = bondArray[i][5] - bondArray[i][0];
						tempArray.push( ["Interest Payable", -1 * diff, bondArray[i][1]] );
					}
					break;

				case "Retirement":
					tempArray.push( ["Bonds Payable", bondArray[i][0], bondArray[i][1]] );
					tempArray.push( ["Cash", -1 * bondArray[i][0], bondArray[i][1]] );
					break;
			}
		}
		else
		{
			switch( bondArray[i][3] )
			{
				case "Issue":
					var diff = bondArray[i][4] - bondArray[i][0];
					tempArray.push( ["Investment in Bonds", bondArray[i][4], bondArray[i][1]] );
					if ( diff != 0 )
						tempArray.push( [ ( diff > 0 ) ? "Discount on Bonds" : "Premium on Bonds", -1 * diff, bondArray[i][1]] );
					tempArray.push( ["Cash", -1 * bondArray[i][0], bondArray[i][1]] );
					break;

				case "Interest Revenue":
					tempArray.push( ["Interest Revenue", -1 * bondArray[i][5], bondArray[i][1]] );
					if ( bondArray[i][0] != 0 )
						tempArray.push( [ ( bondArray[i][0] > 0 ) ? "Discount on Bonds" : "Premium on Bonds" , bondArray[i][0], bondArray[i][1]] );

					if ( bondArray[i][4] != 0 ) 
					{
						tempArray.push( ["Cash", bondArray[i][4], bondArray[i][1]] );
						if ( bondArray[i][4] + bondArray[i][0] != bondArray[i][5] )
						{
							var receivable = bondArray[i][5] - ( bondArray[i][4] + bondArray[i][0] );
							tempArray.push( ["Interest Receivable", receivable, bondArray[i][1]] );
						}
					}
					else 
					{
						var diff = bondArray[i][5] - bondArray[i][0];
						tempArray.push( ["Interest Receivable", diff, bondArray[i][1]] );
					}
					break;

				case "Retirement":
					tempArray.push( ["Cash", bondArray[i][0], bondArray[i][1]] );
					tempArray.push( ["Investment in Bonds", -1 * bondArray[i][0], bondArray[i][1]] );
					break;
			}
		}
		

		JEArray.push( tempArray );
	}

	$("#bondContainer").html(generateJESeries( JEArray, "bond" ));
}

// Warrants

var warrantArray = new Array();
var numWarrants = 0;
var chosen = "";
var autoWarrant = true;

function warrantDisabler()
{
	if ( autoWarrant )
	{
		if ( rateWarrant.value == "" || faceWarrant.value == "" || perWarrant.value == "" )
		{
			$("#mktWarrant").prop('disabled', true );
			$("#cvWarrant").prop('disabled', true );
		}
		else
		{
			if ( chosen == "" )
			{
				if ( mktWarrant.value == "" && cvWarrant.value == "" )
				{
					$("#mktWarrant").prop('disabled', false );
					$("#cvWarrant").prop('disabled', false );	
				}
				else if ( mktWarrant.value != "" && cvWarrant.value == "" )
				{
					$("#cvWarrant").prop('disabled', true );
					$("#cvWarrant").val( Math.round( faceValuation( faceWarrant.value, perWarrant.value, mktWarrant.value, rateWarrant.value, perTypeWarrant.value )));
					chosen = "cv";
				}
				else if ( mktWarrant.value == "" && cvWarrant.value != "" )
				{
					$("#mktWarrant").prop('disabled', true );
					$("#mktWarrant").val( calcBondRate( rateWarrant.value, perWarrant.value, faceWarrant.value, cvWarrant.value, perTypeWarrant.value ));
					chosen = "mkt";
				}
			}
			else
			{
				if ( mktWarrant.value == "" )
				{
					chosen = "";
					$("#cvWarrant").prop('disabled', false);
					$("#cvWarrant").val("");
				}
				else if ( cvWarrant.value == "" )
				{
					chosen = "";
					$("#mktWarrant").prop('disabled', false);
					$("#mktWarrant").val("");
				}
				else if ( chosen == "mkt" ) 
				{
					$("#mktWarrant").prop('disabled', true );
					$("#mktWarrant").val( calcBondRate( rateWarrant.value, perWarrant.value, faceWarrant.value, cvWarrant.value, perTypeWarrant.value ));
				}
				else if ( chosen == "cv" ) 
				{
					$("#cvWarrant").prop('disabled', true );
					$("#cvWarrant").val( Math.round( faceValuation( faceWarrant.value, perWarrant.value, mktWarrant.value, rateWarrant.value, perTypeWarrant.value )));
				}
			}
		}
	}
	else
	{
		$("#mktWarrant").prop('disabled', false );
		$("#cvWarrant").prop('disabled', false );
	}
}

function warrantSort()
{
	var warrantValue = 0;
	var warrantPrice = 0;
	var warrantExercise = 0;
	var parValue = 0;
	sorter( warrantArray );

	for ( var i = 0; i < warrantArray.length; i++ )
	{
		switch( warrantArray[i][3] )
		{
			case "Issuance":
				numWarrants = parseInt(warrantArray[i][5]);
				warrantValue = parseInt(warrantArray[i][5]) * parseInt(warrantArray[i][6]);
				warrantPrice = parseInt(warrantArray[i][6]);
				parValue = parseInt(warrantArray[i][7]);
				warrantExercise = parseInt(warrantArray[i][8]);
				warrantArray[i][2] = warrantValue;
				break;

			case "Exercise":
				numWarrants += warrantArray[i][0];
				warrantArray[i][0] *= ( -1 * warrantPrice );
				warrantArray[i][6] = parseInt(warrantArray[i][5]) * warrantExercise;
				warrantArray[i][7] = warrantArray[i][5] * parValue;
				warrantArray[i][8] = ( warrantArray[i][6] - warrantArray[i][0] ) - warrantArray[i][7];
				warrantValue += warrantArray[i][0];
				warrantArray[i][2] = warrantValue;
				break;
		}
	}
}

function warrantAddBond( face, carryingValue, issueDate, warrantNum, warrantMkt, stockPar, warrantExer )
{
	if ( face == "" || carryingValue == "" || issueDate == "" || warrantNum == "" || warrantMkt == "" || stockPar == "" || warrantExer == "" )
	{
		warrantDisplayError("Missing information!");
		return;
	}

	if( warrantArray.length != 0 )
	{
		warrantDisplayError("This application does not support multiple bonds yet!");
		return;
	}

	var entry = [ parseInt(carryingValue), issueDate, , "Issuance", parseInt(face), parseInt(warrantNum), parseInt(warrantMkt), parseInt(stockPar), parseInt(warrantExer) ];

	warrantArray.push( entry );
	warrantSort();

	warrantUpdateTable();
}

function warrantAddExercise( numExercised, mktValue, exDate )
{
	if ( numExercised == "" || mktValue == "" || exDate == "" )
	{
		warrantDisplayError("Missing information!");
		return;
	}

	var oldDate = new Date( warrantArray[0][1] ).getTime();
	var currDate = new Date( exDate ).getTime();

	if ( oldDate > currDate )
	{
		warrantDisplayError("Cannot exercise warrants before warrants are issued!");
		return;
	}

	if ( numWarrants < numExercised )
	{
		warrantDisplayError("Cannot exercise more warrants than were issued!");
		return;
	}

	var entry = [ parseInt(numExercised), exDate, , "Exercise", parseInt(mktValue), parseInt(numExercised) ];

	warrantArray.push( entry );
	warrantSort();

	warrantUpdateTable();

}

function warrantUpdateTable()
{
	$("#warrantEntries tbody").empty();

	for ( var i = 0; i < warrantArray.length; i++ )
		$("#warrantEntries tbody").append('<tr><td>' + (i + 1) + '</td><td>' + accountify( warrantArray[i][0], "" ) + '</td><td>' + warrantArray[i][1] + '</td><td>$' + accountify( warrantArray[i][2], "" ) + '</td><td>' + warrantArray[i][3] + '</td></tr>');

}

function warrantDisplayError( errorText )
{
    $(this).scrollTop(0);
    $("#warrantErrorText").text( errorText );
    $("#warrantErrorDiv").show().delay(1500).fadeOut( "slow", function() { $("#warrantErrorDiv").hide(); } );
}

function warrantDisplayWarning( errorText )
{
    $(this).scrollTop(0);
    $("#warrantWarningText").text( errorText );
    $("#warrantWarningDiv").show().delay(1500).fadeOut( "slow", function() { $("#warrantWarningDiv").hide(); } );
}

function warrantJEGeneration()
{
	if( warrantArray.length == 0 )
	{
		warrantDisplayError("No information has been submitted!");
		return;
	}

	var JEArray = new Array();
	for ( var i = 0; i < warrantArray.length; i++ )
	{
		var tempArray = new Array();
		switch( warrantArray[i][3] )
		{
			case "Issuance":
				tempArray.push( ["Cash", warrantArray[i][0], warrantArray[i][1]] );
				tempArray.push( ["Paid-In Capital - Warrants", -1 * warrantArray[i][2], warrantArray[i][1]] );
				tempArray.push( ["Bonds Payable", -1 * warrantArray[i][4], warrantArray[i][1]] );

				var diff = parseInt(warrantArray[i][4]) + parseInt(warrantArray[i][2]) - parseInt(warrantArray[i][0]);
				if ( diff != 0 )
					tempArray.push( [ ( diff > 0 ) ? "Discount on Bonds Payable" : "Premium on Bonds Payable", diff, warrantArray[i][1]] );
				break;

			case "Exercise":
				tempArray.push( ["Cash", warrantArray[i][6], warrantArray[i][1]] );
				tempArray.push( ["Paid-In Capital - Warrants", -1 * warrantArray[i][0], warrantArray[i][1]] );
				tempArray.push( ["Common Stock", -1 * warrantArray[i][7], warrantArray[i][1]] );
				tempArray.push( ["Paid-In Capital - Excess of Par", -1 * warrantArray[i][8], warrantArray[i][1]] );
				break;
		}

		JEArray.push( tempArray );
	}

	$("#warrantContainer").html(generateJESeries( JEArray, "warrant" ));
}

// Helper Functions

function amortMidQuarterUpdate( face, mktRate, intRate, times, date, periods, effective, table, endOfYear )
{
	var initialCarry = faceValuation( face, periods, mktRate, intRate, times );
	var errorTolerance = 5;
	var counter = 1;
	var cycleCounter = 1;
	var perIndex = 0;

	var compArray = new Array();

	for ( var i = 1; i <= times; i++ );
	{
		var c = new Date( date );
		var e = new Date( endOfYear );

		c.setMonth( c.getMonth() + (12 / times));
		c.setMinutes(c.getMinutes() + c.getTimezoneOffset());
		c.setDate( c.getDate() - 1 );

		e.setMinutes(e.getMinutes() + e.getTimezoneOffset());
		e.setFullYear( c.getFullYear() );
		if ( e.getTime() > c.getTime() )
			perIndex++;
	}

	var f = new Date( date );
	f.setMinutes( f.getMinutes() + f.getTimezoneOffset());
	f.setFullYear( f.getFullYear() + (periods / times));
	f.setDate( f.getDate() - 1 );

	$("#" + table + "Table tbody").empty();
	$("#" + table + "Table tbody").append('<tr><td>' + date + '</td><td></td><td></td><td></td><td>' + accountify( Math.round( initialCarry ), "" ) + '</td></tr>');

	compArray.push( [date, Math.round( initialCarry ), face, f.getFullYear() + "-" + ( parseInt( f.getMonth() ) + 1 ) + "-" + f.getDate()] );

	while ( counter <= periods )
	{
		var cash = Math.round( calcCash( face, intRate, ( 12 / times )));
		var interest;
		var principal;
		console.log( date );

		var d = new Date( date );
		d.setMinutes( d.getMinutes() + d.getTimezoneOffset() );
		d.setMonth( d.getMonth() + ( 12 / times ) * counter );
		d.setDate( d.getDate() - 1 );

		if ( effective == 1 )
		{
			interest = Math.round( calcInt( initialCarry, mktRate, ( 12 / times )));
			principal = interest - cash;
		}
		else
		{
			principal = Math.round(( face - initialCarry ) / ( periods - ( counter - 1 )));
			interest = cash + principal;
		}

		if ( cycleCounter == ( perIndex + 1 )) 
		{
			console.log( d.getMonth() );
			console.log( e.getMonth() );
			var dataOffset;

			(d.getMonth() >= e.getMonth() ) ? dateOffset = Math.abs(( d.getMonth() -  e.getMonth() )) : dateOffset = Math.abs((d.getMonth() + 12 - e.getMonth()));
			console.log("----");

			var secondInterest = Math.round( interest * ( dateOffset / ( 12 / times )));
			// var firstInterest = Math.round( interest * ( Math.abs((12 / times) - dateOffset)) / (12 / times));
			var firstInterest = interest - secondInterest;

			var secondPrincipal = Math.round( principal * ( dateOffset / ( 12 / times )));
			// var firstPrincipal = Math.round( principal * ( Math.abs((12 / times) - dateOffset)) / (12 / times));
			var firstPrincipal = principal - secondPrincipal;

			initialCarry = Math.round( secondPrincipal + initialCarry );

			compArray.push( [ 0, firstInterest, firstPrincipal, d.getFullYear() + "-" + ( parseInt( e.getMonth() ) + 1 ) + "-" + e.getDate(), initialCarry ] );

			$("#" + table + "Table tbody").append('<tr><td>' + d.getFullYear() + "-" + ( parseInt( e.getMonth() ) + 1 ) + "-" + e.getDate() + '</td><td>0</td><td>' + accountify( firstInterest, "" ) + '</td><td>' + accountify( firstPrincipal, "" ) + '</td><td>' + accountify( initialCarry, "" ) + '</td></tr>');

			initialCarry = Math.round( secondPrincipal + initialCarry );
			if ( counter == periods && Math.abs( face - initialCarry) < errorTolerance ) 
			{
				interest += Math.abs( face - initialCarry );
				principal += Math.abs( face - initialCarry );
				initialCarry = face;
			}
			compArray.push( [ cash, secondInterest, secondPrincipal, d.getFullYear() + "-" + ( parseInt( d.getMonth() ) + 1 ) + "-" + d.getDate(), initialCarry ] );

			$("#" + table + "Table tbody").append('<tr><td>' + d.getFullYear() + "-" + ( parseInt( d.getMonth() ) + 1 ) + "-" + d.getDate() + '</td><td>' + accountify( cash, "" ) + '</td><td>' + accountify( secondInterest, "" ) + '</td><td>' + accountify( secondPrincipal, "" ) + '</td><td>' + accountify( initialCarry, "" ) + '</td></tr>');
		}
		else
		{
			initialCarry = Math.round( principal + initialCarry );	
			if ( counter == periods && Math.abs( face - initialCarry) < errorTolerance ) 
			{
				interest += Math.abs( face - initialCarry );
				principal += Math.abs( face - initialCarry );
				initialCarry = face;
			}

			compArray.push( [ cash, interest, principal, d.getFullYear() + "-" + ( parseInt( d.getMonth() ) + 1 ) + "-" + d.getDate(), initialCarry ] );

			$("#" + table + "Table tbody").append('<tr><td>' + d.getFullYear() + "-" + ( parseInt( d.getMonth() ) + 1 ) + "-" + d.getDate() + '</td><td>' + accountify( cash, "" ) + '</td><td>' + accountify( interest, "" ) + '</td><td>' + accountify( principal, "" ) + '</td><td>' + accountify( initialCarry, "" ) + '</td></tr>');
		}

		counter++;
		( cycleCounter == times ) ? cycleCounter = 1 : cycleCounter++;
	}

	return compArray;
}

function amortTableUpdate( face, mktRate, intRate, times, date, periods, effective, table )
{
	var initialCarry = faceValuation( face, periods, mktRate, intRate, times );
	var errorTolerance = 5;
	var counter = 1;

	var compArray = new Array();

	$("#" + table + "Table tbody").empty();
	$("#" + table + "Table tbody").append('<tr><td>' + date + '</td><td></td><td></td><td></td><td>' + accountify( Math.round( initialCarry ), "" ) + '</td></tr>');

	var f = new Date( date );
	f.setMinutes( f.getMinutes() + f.getTimezoneOffset());
	f.setFullYear( f.getFullYear() + (periods / times));
	f.setDate( f.getDate() - 1 );

	compArray.push( [date, Math.round( initialCarry ), face, f.getFullYear() + "-" + ( parseInt( f.getMonth() ) + 1 ) + "-" + f.getDate()] );

	while ( counter <= periods )
	{
		var cash = Math.round( calcCash( face, intRate, ( 12 / times )));
		var interest;
		var principal;
		if ( effective == 1 )
		{
			interest = Math.round( calcInt( initialCarry, mktRate, ( 12 / times )));
			principal = interest - cash;
		}
		else
		{
			principal = Math.round(( face - initialCarry ) / ( periods - ( counter - 1 )));
			interest = cash + principal;
		}
		
		initialCarry = Math.round( principal + initialCarry );	
		if ( counter == periods && Math.abs( face - initialCarry) < errorTolerance ) 
		{
			interest += Math.abs( face - initialCarry );
			principal += Math.abs( face - initialCarry );
			initialCarry = face;
		}
		var d = new Date( date );
		d.setMinutes( d.getMinutes() + d.getTimezoneOffset() );
		d.setMonth( d.getMonth() + ( 12 / times ) * counter );
		d.setDate( d.getDate() - 1 );

		compArray.push( [ cash, interest, principal, d.getFullYear() + "-" + ( parseInt( d.getMonth() ) + 1 ) + "-" + d.getDate(), initialCarry ] );
		$("#" + table + "Table tbody").append('<tr><td>' + d.getFullYear() + "-" + ( parseInt( d.getMonth() ) + 1 ) + "-" + d.getDate() + '</td><td>' + accountify( cash, "" ) + '</td><td>' + accountify( interest, "" ) + '</td><td>' + accountify( principal, "" ) + '</td><td>' + accountify( initialCarry, "" ) + '</td></tr>');

		counter++;
	}

	return compArray;
}

// Convertible bondSort

var convertArray = new Array();
var autoConvert = true;
var chose = "";

function convertDisabler()
{
	if ( autoConvert )
	{
		if ( rateConvert.value == "" || faceConvert.value == "" || perConvert.value == "" )
		{
			$("#mktConvert").prop('disabled', true );
			$("#cvConvert").prop('disabled', true );
		}
		else
		{
			if ( chose == "" )
			{
				if ( mktConvert.value == "" && cvConvert.value == "" )
				{
					$("#mktConvert").prop('disabled', false );
					$("#cvConvert").prop('disabled', false );	
				}
				else if ( mktConvert.value != "" && cvConvert.value == "" )
				{
					$("#cvConvert").prop('disabled', true );
					$("#cvConvert").val( Math.round( faceValuation( faceConvert.value, perConvert.value, mktConvert.value, rateConvert.value, perTypeConvert.value )));
					chose = "cv";
				}
				else if ( mktConvert.value == "" && cvConvert.value != "" )
				{
					$("#mktConvert").prop('disabled', true );
					$("#mktConvert").val( calcBondRate( rateConvert.value, perConvert.value, faceConvert.value, cvConvert.value, perTypeConvert.value ));
					chose = "mkt";
				}
			}
			else
			{
				if ( mktConvert.value == "" )
				{
					chose = "";
					$("#cvConvert").prop('disabled', false);
					$("#cvConvert").val("");
				}
				else if ( cvConvert.value == "" )
				{
					chose = "";
					$("#mktConvert").prop('disabled', false);
					$("#mktConvert").val("");
				}
				else if ( chose == "mkt" ) 
				{
					$("#mktConvert").prop('disabled', true );
					$("#mktConvert").val( calcBondRate( rateConvert.value, perConvert.value, faceConvert.value, cvConvert.value, perTypeConvert.value ));
				}
				else if ( chose == "cv" ) 
				{
					$("#cvConvert").prop('disabled', true );
					$("#cvConvert").val( Math.round( faceValuation( faceConvert.value, perConvert.value, mktConvert.value, rateConvert.value, perTypeConvert.value )));
				}
			}
		}
	}
	else
	{
		$("#mktConvert").prop('disabled', false );
		$("#cvConvert").prop('disabled', false );
	}
}

function convertSort()
{
	var remainingBonds = 0;
	sorter( convertArray );

	for ( var i = 0; i < convertArray.length; i++ )
	{
		switch( convertArray[i][3] )
		{
			case "Issuance":
				remainingBonds = convertArray[i][4];
				// convertArray[i][2] = 
				break;

			case "Exercise":
				numWarrants += warrantArray[i][0];
				warrantArray[i][0] *= ( -1 * warrantPrice );
				warrantArray[i][6] = parseInt(warrantArray[i][5]) * warrantExercise;
				warrantArray[i][7] = warrantArray[i][5] * parValue;
				warrantArray[i][8] = ( warrantArray[i][6] - warrantArray[i][0] ) - warrantArray[i][7];
				warrantValue += warrantArray[i][0];
				warrantArray[i][2] = warrantValue;
				break;
		}
	}
}


function convertAddBond( face, carryingValue, issueDate, numTimes, divisor, numConvert, method, par )
{
	if( face == "" || carryingValue == "" || issueDate == "" || divisor == "" || numConvert == "" || par == "" )
	{
		convertDisplayError("Missing information!");
		return;
	}

	if( convertArray.length != 0 )
	{
		convertDisplayError("This application does not support multiple bonds yet!");
		return;
	}

	var entry = [ parseInt(carryingValue), issueDate, , "Issuance", parseInt(face), parseInt(numTimes), parseInt(divisor), parseInt(numConvert), parseInt(method), parseInt(par) ];

	convertArray.push( entry );
	convertSort();

	convertUpdateTable();
}

function convertAddConversion( elapsedPer, valueConv, mktValue, numTimes )
{
	
}

function convertUpdateTable()
{
	$("#convertEntries tbody").empty();

	for ( var i = 0; i < convertArray.length; i++ )
		$("#convertEntries tbody").append('<tr><td>' + (i + 1) + '</td><td>' + accountify( convertArray[i][0], "" ) + '</td><td>' + convertArray[i][1] + '</td><td>$' + accountify( convertArray[i][2], "" ) + '</td><td>' + convertArray[i][3] + '</td></tr>');
}

function convertDisplayError( errorText )
{
    $(this).scrollTop(0);
    $("#convertErrorText").text( errorText );
    $("#convertErrorDiv").show().delay(1500).fadeOut( "slow", function() { $("#convertErrorDiv").hide(); } );
}

function convertDisplayWarning( errorText )
{
    $(this).scrollTop(0);
    $("#convertWarningText").text( errorText );
    $("#convertWarningDiv").show().delay(1500).fadeOut( "slow", function() { $("#convertWarningDiv").hide(); } );
}