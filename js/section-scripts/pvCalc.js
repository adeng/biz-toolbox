function displayResult( item, result )
{
	bootbox.alert( "<b>" + item + "</b> " + result);
}

// Calculate Functions

function calcFV( pmt, rate, per )
{
	if ( pmt == "" || rate == "" || per == "" )
	{
		bootbox.alert("Missing information!");
		return;
	}

	var result = "<b>Future Value of Lump Sum:</b> $" +  accountify( Math.round( futureValue( pmt, rate, per )), "" );
	bootbox.alert( result );
}

function calcFVA( pmt, rate, per, due )
{
	if ( pmt == "" || rate == "" || per == "" )
	{
		bootbox.alert("Missing information!");
		return;
	}

	var result = "<b>Future Value of Annuity:</b> $";
	fvAmount = due ? futureValueAnnuityDue( pmt, rate, per ) : futureValueAnnuity( pmt, rate, per );
	bootbox.alert( result + accountify( Math.round( fvAmount ), "" ));
}

function calcPV( pmt, rate, per )
{
	if ( pmt == "" || rate == "" || per == "" )
	{
		bootbox.alert("Missing information!");
		return;
	}

	var result = "<b>Present Value of Lump Sum:</b> $" +  accountify( Math.round( presentValue( pmt, rate, per )), "" );
	bootbox.alert( result );	
}

function calcPVA( pmt, rate, per, due )
{
	if ( pmt == "" || rate == "" || per == "" )
	{
		bootbox.alert("Missing information!");
		return;
	}

	var result = "<b>Present Value of Annuity:</b> $";
	fvAmount = due ? presentValueAnnuityDue( pmt, rate, per ) : presentValueAnnuity( pmt, rate, per );
	bootbox.alert( result + accountify( Math.round( fvAmount ), "" ));
}