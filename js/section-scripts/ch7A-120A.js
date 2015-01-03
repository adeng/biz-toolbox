$(document).ready( function() {
	$("#perInt").tooltip({ container: 'body' });
	$("#fiscDefault").tooltip({ container: 'body' });
	$("#intSubmit").tooltip({ container: 'body' });
	$("#perTypeInt").val("2");
	$("#mktNon").tooltip({ container: 'body' });
	$("#fiscDefaultNon").tooltip({ container: 'body' });
});

// Interest-Bearing Note

var interestArray = new Array();

function interestSort()
{
	sorter( interestArray );
	var carryingValue = 0;

	for ( var i = 0; i < interestArray.length; i++ )
	{
		switch( interestArray[i][3] )
		{
			case "Issue":
				carryingValue = interestArray[i][2];
				break;

			case "Interest Revenue":
				carryingValue += interestArray[i][0];
				break;

			case "Retirement":
				break;
		}

		interestArray[i][2] = carryingValue;
	}
}

function interestAddNote( face, mktRate, noteRate, issueDate, periods, method, effective, fiscal )
{
	interestArray.length = 0;
	var newEntries = new Array();
	if ( face == "" || mktRate == "" || noteRate == "" || issueDate == "" || periods == "" || fiscal == "" )
	{
		interestDisplayError("Missing information!");
		return;
	}

	var d = new Date( issueDate );
	d.setMinutes( d.getMinutes() + d.getTimezoneOffset() );

	(isDefault( fiscal ) && isOriginal( issueDate )) ? newEntries = amortTableUpdate( face, mktRate, noteRate, method, issueDate, periods, effective, "interest" ) : newEntries = amortMidQuarterUpdate( face, mktRate, noteRate, method, issueDate, periods, effective, "interest", fiscal );

	interestArray.push( [newEntries[0][1], newEntries[0][0], newEntries[0][1], "Issue", newEntries[0][2]]);
	interestArray.push( [newEntries[0][2], newEntries[0][3], 0, "Retirement" ] );

	for ( var i = 1; i < newEntries.length; i++ )
	{
		interestArray.push( [newEntries[i][2], newEntries[i][3], , "Interest Revenue", newEntries[i][0], newEntries[i][1]] );
	}

	interestSort();
}

function interestDisplayError( errorText )
{
    $(this).scrollTop(0);
    $("#interestErrorText").text( errorText );
    $("#interestErrorDiv").show().delay(1500).fadeOut( "slow", function() { $("#interestErrorDiv").hide(); } );
}

function interestDisplayWarning( errorText )
{
    $(this).scrollTop(0);
    $("#interestWarningText").text( errorText );
    $("#interestWarningDiv").show().delay(1500).fadeOut( "slow", function() { $("#interestWarningDiv").hide(); } );
}

function interestJEGeneration()
{
	if ( interestArray.length == 0 )
	{
		interestDisplayError("No information has been submitted!");
		return;
	}

	var JEArray = new Array();
	for ( var i = 0; i < interestArray.length; i++ )
	{
		var tempArray = new Array();
		switch( interestArray[i][3] )
		{
			case "Issue":
				var diff = interestArray[i][4] - interestArray[i][0];
				tempArray.push( ["Notes Receivable", interestArray[i][4], interestArray[i][1]] );
				if ( diff != 0 )
					tempArray.push( [ ( diff > 0 ) ? "Discount on Notes Receivable" : "Premium on Notes Receivable", -1 * diff, interestArray[i][1]] );
				tempArray.push( ["Sales Revenue", -1 * interestArray[i][0], interestArray[i][1]] );
				break;

			case "Interest Revenue":
				if ( interestArray[i][0] != 0 )
					tempArray.push( [ ( interestArray[i][0] > 0 ) ? "Discount on Notes Receivable" : "Premium on Notes Receivable" , interestArray[i][0], interestArray[i][1]] );
				tempArray.push( ["Interest Revenue", -1 * interestArray[i][5], interestArray[i][1]] );

				if ( interestArray[i][4] != 0 ) 
				{
					tempArray.push( ["Cash", interestArray[i][4], interestArray[i][1]] );
					if ( interestArray[i][4] + interestArray[i][0] != interestArray[i][5] )
					{
						var receivable = interestArray[i][5] - ( interestArray[i][4] + interestArray[i][0] );
						tempArray.push( ["Interest Receivable", receivable, interestArray[i][1]] );
					}
				}
				else 
				{
					var diff = interestArray[i][5] - interestArray[i][0];
					tempArray.push( ["Interest Receivable", diff, interestArray[i][1]] );
				}
				break;

			case "Retirement":
				tempArray.push( ["Cash", interestArray[i][0], interestArray[i][1]] );
				tempArray.push( ["Notes Receivable", -1 * interestArray[i][0], interestArray[i][1]] );
				break;
		}

		JEArray.push( tempArray );
	}

	$("#interestContainer").html(generateJESeries( JEArray, "interest" ));
}

// Noninterest-Bearing Notes

var nonArray = new Array();

function nonSort()
{
	sorter( nonArray );
	var carryingValue = 0;

	for ( var i = 0; i < nonArray.length; i++ )
	{
		switch( nonArray[i][3] )
		{
			case "Issue":
				carryingValue = nonArray[i][2];
				break;

			case "Interest Revenue":
				carryingValue += nonArray[i][0];
				break;

			case "Retirement":
				break;
		}

		nonArray[i][2] = carryingValue;
	}
}

function nonAddNote( face, discRate, issueDate, periods, effective, fiscal )
{
	interestArray.length = 0;
	var newEntries = new Array();
	if ( face == "" || discRate == "" || issueDate == "" || periods == "" || fiscal == "" )
	{
		nonDisplayError("Missing information!");
		return;
	}

	var d = new Date( issueDate );
	d.setMinutes( d.getMinutes() + d.getTimezoneOffset() );

	(isDefault( fiscal ) && isOriginal( issueDate )) ? newEntries = amortTableUpdate( face, discRate, 0, 1, issueDate, periods, effective, "non" ) : newEntries = amortMidQuarterUpdate( face, discRate, 0, 1, issueDate, periods, effective, "non", fiscal );

	nonArray.push( [newEntries[0][1], newEntries[0][0], newEntries[0][1], "Issue", newEntries[0][2]]);
	nonArray.push( [newEntries[0][2], newEntries[0][3], 0, "Retirement" ] );

	for ( var i = 1; i < newEntries.length; i++ )
	{
		nonArray.push( [newEntries[i][2], newEntries[i][3], , "Interest Revenue", newEntries[i][0], newEntries[i][1]] );
	}

	nonSort();
}

function nonDisplayError( errorText )
{
    $(this).scrollTop(0);
    $("#nonErrorText").text( errorText );
    $("#nonErrorDiv").show().delay(1500).fadeOut( "slow", function() { $("#nonErrorDiv").hide(); } );
}

function nonDisplayWarning( errorText )
{
    $(this).scrollTop(0);
    $("#nonWarningText").text( errorText );
    $("#nonWarningDiv").show().delay(1500).fadeOut( "slow", function() { $("#nonWarningDiv").hide(); } );
}

function nonJEGeneration()
{
	if ( nonArray.length == 0 )
	{
		nonDisplayError("No information has been submitted!");
		return;
	}

	var JEArray = new Array();
	for ( var i = 0; i < nonArray.length; i++ )
	{
		var tempArray = new Array();
		switch( nonArray[i][3] )
		{
			case "Issue":
				var diff = nonArray[i][4] - nonArray[i][0];
				tempArray.push( ["Notes Receivable", nonArray[i][4], nonArray[i][1]] );
				if ( diff != 0 )
					tempArray.push( [ ( diff > 0 ) ? "Discount on Notes Receivable" : "Premium on Notes Receivable", -1 * diff, nonArray[i][1]] );
				tempArray.push( ["Sales Revenue", -1 * nonArray[i][0], nonArray[i][1]] );
				break;

			case "Interest Revenue":
				if ( nonArray[i][0] != 0 )
					tempArray.push( [ ( nonArray[i][0] > 0 ) ? "Discount on Notes Receivable" : "Premium on Notes Receivable" , nonArray[i][0], nonArray[i][1]] );
				tempArray.push( ["Interest Revenue", -1 * nonArray[i][5], nonArray[i][1]] );

				if ( nonArray[i][4] != 0 ) 
				{
					tempArray.push( ["Cash", nonArray[i][4], nonArray[i][1]] );
					if ( nonArray[i][4] + nonArray[i][0] != nonArray[i][5] )
					{
						var receivable = nonArray[i][5] - ( nonArray[i][4] + nonArray[i][0] );
						tempArray.push( ["Interest Receivable", receivable, nonArray[i][1]] );
					}
				}
				else 
				{
					var diff = nonArray[i][5] - nonArray[i][0];
					tempArray.push( ["Interest Receivable", diff, nonArray[i][1]] );
				}
				break;

			case "Retirement":
				tempArray.push( ["Cash", nonArray[i][0], nonArray[i][1]] );
				tempArray.push( ["Notes Receivable", -1 * nonArray[i][0], nonArray[i][1]] );
				break;
		}

		JEArray.push( tempArray );
	}

	$("#nonContainer").html(generateJESeries( JEArray, "non" ));
}

// Installment Notes

var installArray = new Array();

function installSort()
{
	sorter( installArray );
	var carryingValue = 0;

	for ( var i = 0; i < installArray.length; i++ )
	{
		switch( installArray[i][3] )
		{
			case "Issue":
				carryingValue = installArray[i][2];
				break;

			case "Interest Revenue":
				carryingValue += installArray[i][0];
				break;
		}

		installArray[i][2] = carryingValue;
	}
}

function installAddNote( face, discRate, issueYear, periods, method, nonInterest )
{
	interestArray.length = 0;
	var newEntries = new Array();
	if ( face == "" || discRate == "" || issueYear == "" || periods == "" )
	{
		installDisplayError("Missing information!");
		return;
	}

	var d = new Date( issueYear + "-01-01" );
	d.setMinutes( d.getMinutes() + d.getTimezoneOffset() );

	newEntries = amortInstallNote( face, discRate, method, issueYear + "-01-01", periods, "install", nonInterest );

	installArray.push( [newEntries[0][1], newEntries[0][0], newEntries[0][1], "Issue"]);

	for ( var i = 1; i < newEntries.length; i++ )
	{
		installArray.push( [newEntries[i][2], newEntries[i][3], , "Interest Revenue", newEntries[i][0], newEntries[i][1]] );
	}

	installSort();
}

function installDisplayError( errorText )
{
    $(this).scrollTop(0);
    $("#installErrorText").text( errorText );
    $("#installErrorDiv").show().delay(1500).fadeOut( "slow", function() { $("#installErrorDiv").hide(); } );
}

function installDisplayWarning( errorText )
{
    $(this).scrollTop(0);
    $("#installWarningText").text( errorText );
    $("#installWarningDiv").show().delay(1500).fadeOut( "slow", function() { $("#installWarningDiv").hide(); } );
}

function installJEGeneration()
{
	if ( installArray.length == 0 )
	{
		installDisplayError("No information has been submitted!");
		return;
	}

	var JEArray = new Array();
	for ( var i = 0; i < installArray.length; i++ )
	{
		var tempArray = new Array();
		switch( installArray[i][3] )
		{
			case "Issue":
				tempArray.push( ["Notes Receivable", installArray[i][0], installArray[i][1]] );
				tempArray.push( ["Sales Revenue", -1 * installArray[i][0], installArray[i][1]] );
				break;

			case "Interest Revenue":
				tempArray.push( ["Notes Receivable" , installArray[i][0], installArray[i][1]] );
				tempArray.push( ["Interest Revenue", -1 * installArray[i][5], installArray[i][1]] );
				tempArray.push( ["Cash", installArray[i][4], installArray[i][1]] );
				break; 
		}

		JEArray.push( tempArray );
	}

	$("#installContainer").html(generateJESeries( JEArray, "install" ));
}

// Helper Functions

function amortMidQuarterUpdate( face, mktRate, intRate, times, date, periods, effective, table, endOfYear )
{
	var initialCarry = faceValuation( face, periods, mktRate, intRate, times );
	var errorTolerance = 2;
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
	var errorTolerance = 2;
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

function amortInstallNote( face, intRate, times, date, periods, table, non )
{
	var initialCarry = non ? presentValueAnnuity( face/periods, intRate/times, periods ) : face;
	var errorTolerance = 10;
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
		var cash = non ? Math.round(face / periods) : Math.round(calcInstallCash( face, intRate / times, periods ));
		var interest;
		var principal;

		interest = Math.round( calcInt( initialCarry, intRate, ( 12 / times )));
		principal = interest - cash;
				
		initialCarry = Math.round( principal + initialCarry );	
		if ( counter == periods && Math.abs( 0 - initialCarry) < errorTolerance ) 
		{
			interest += 0 - initialCarry;
			principal += 0 - initialCarry;
			initialCarry = 0;
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