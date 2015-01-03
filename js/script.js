var currID = "inventoryDash";

// Page display methods

function navToPage( id )
{
    show(id, currID);
    var oldID = currID.substring(0, currID.indexOf("Dash")) + "Li";
    $("#" + oldID).removeClass("active");
    currID = id;

    var liID = id.substring(0, id.indexOf("Dash")) + "Li";
    $("#" + liID).addClass("active");
}

function show(shown, hidden) 
{
    document.getElementById(hidden).style.display='none';
    document.getElementById(shown).style.display='block';
    return false;
}

function isBreakpoint( alias ) {
	return $('.device-' + alias).is(':visible');
}

$(document).ready( function() {
	$(document).on('click', ".nav a", function(){
		if ( isBreakpoint('xs') )
    		$(".navbar-toggle").click();
	});
});


// Accounting methods
function balanceCrDr( debits, credits )
{
	// Return negative if requires credit, positive if requires debit
	return credits - debits;
}

// Use for net debit
function balanceDrCr( debits, credits )
{
	return debits - credits;
}

// Accept input in the form of 2D arrays, with first row being the accounts
// and the second row being the numerical value
function generateJE( accountArray )
{
	var appendString = '';
	var debitArray = new Array();
	var creditArray = new Array();
 
	for ( var a in accountArray ) 
	{ 
		if ( accountArray[a][1] != 0 ) 
		{
			var tempArray = [ accountArray[a][0], accountify(Math.abs(accountArray[a][1]), ""), accountArray[a][2] ]; 

			if ( accountArray[a][1] < 0 ) 
				creditArray.push( tempArray );
			else
				debitArray.push( tempArray );  
		} 
	}
	console.log(creditArray);

	appendString += '<dl>';
	appendString += '<dt>' + accountArray[a][2] + '</dt><dd>';

	for( var i in debitArray )
		appendString += '<p class="debits">' + debitArray[i][0] + ' <span class="pull-right">' + debitArray[i][1] + '</span></p>';

	for( var j in creditArray )
		appendString += '<p class="credits">' + creditArray[j][0] + ' <span class="pull-right">' + creditArray[j][1] + '</span></p>';

	appendString += '</dd></dl>';
	return appendString;
}

function generateJESeries( accountArrayArray, series )
{
	var appendString = '<h4>Journal Entries</h4><hr>';
	for ( var i = 0; i < accountArrayArray.length; i++ )
	{
		appendString += '<div class="journal-entry" id="' + series + i + '">';
		appendString += generateJE( accountArrayArray[i] );
		appendString += '</div><br />';
	}
	
	return appendString;
}

// Helper methods

function unCamel( string )
{
	var fullString = string[0];
	for( var i = 1; i < string.length; i++ )
	{
		if( string[i] == string[i].toUpperCase() )
			fullString += " ";
		fullString += string[i];
	}

	return fullString;
}

function numDigits( number )
{
	if ( number % 10 == number )
		return 1;
	return 1 + numDigits( Math.floor( number / 10 ) );
}

function printZeros( numZeros )
{
	var str = "";

	for ( var i = 0; i < numZeros; i++ )
		str += "0";

	return str;
}

function forceDigits( str, digits )
{
	return printZeros( digits - str.length ) + str;
}

function accountify( number, string )
{
	if ( ( number < 0 ) ? Math.ceil( number / 1000 ) == 0 : Math.floor( number / 1000 ) == 0 )
		return ( number >= 0 ) ? number + string : "(" + Math.abs(number) + string + ")";
	return accountify( ( number < 0 ) ? Math.ceil( number / 1000 ) : Math.floor( number / 1000 ), "," + forceDigits( Math.abs( number % 1000 ) + "", 3 ) + string );
} 

function showSection( section )
{
	$(".navbar-nav li").removeClass('active');
	$("#" + section + "Li").addClass('active');
	$(".section-holder").hide();
	$("#" + section + "Section").show();
}

function sorter( arrayName )
{
	arrayName.sort( function( a, b ) {
		var dateA = new Date( a[1] );
		var dateB = new Date( b[1] );

		return dateA.getTime() - dateB.getTime();
	});
}

// Finance functions!