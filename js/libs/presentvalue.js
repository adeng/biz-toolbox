// Time Value of Money

function futureValue( amount, rate, periods )
{
	return amount * Math.pow( (1 + (rate/100)), periods );
}

function presentValue( amount, rate, periods )
{
	return amount / Math.pow( (1 + (rate/100)), periods );
}

function futureValueAnnuity( amount, rate, periods )
{
	return amount * ( Math.pow( 1 + ( 	rate / 100 ), periods ) - 1) / ( rate / 100 );
}

function presentValueAnnuity( amount, rate, periods )
{
	return amount * ( 1 - ( 1 / Math.pow( 1 + ( rate / 100 ), periods ))) / ( rate / 100 );
}

function futureValueAnnuityDue( amount, rate, periods )
{
	return amount * (( Math.pow( 1 + ( 	rate / 100 ), periods ) - 1) / ( rate / 100 )) * ( 1 + ( rate / 100 ));
}

function presentValueAnnuityDue( amount, rate, periods )
{
	return amount * (( 1 - ( 1 / Math.pow( 1 + ( rate / 100 ), periods ))) / ( rate / 100 )) * ( 1 + ( rate / 100 ));
}

// Calculation Methods

function calcBondRate( initRate, periods, face, expected, times )
{
	var increment = 0.1;
	var currGuess = initRate;
	var tableNum = faceValuation( face, periods, initRate, initRate, times );

	if ( expected == tableNum )
		return initRate;
	else if ( expected > tableNum )
	{
		while ( increment != 0.0001 )
		{
			while ( expected > Math.round( faceValuation( face, periods, currGuess - increment, initRate, times )))
			{
				currGuess -= increment;
			}

			increment /= 10;
		}
	}
	else if ( expected < tableNum )
	{
		while ( increment != 0.0001 )
		{
			while ( expected < Math.round( faceValuation( face, periods, currGuess + increment, initRate, times )))
			{
				currGuess += increment;
			}

			increment /= 10;
		}
	}

	return Math.round(currGuess * 100) / 100;
}

function calcPVARate( initRate, periods, expected )
{
	var increment = 0.1;
	var currGuess = initRate;
	var tableNum = parseFloat( presentValueAnnuity( 1, initRate, periods ).toFixed(5) );

	if ( Math.abs( expected - tableNum ) < 0.001 )
		return initRate;
	else if ( expected > tableNum )
	{
		while ( increment != 0.0001 )
		{
			while ( expected > parseFloat( presentValueAnnuity( 1, currGuess - increment, periods ).toFixed(5) ) )
			{
				currGuess -= increment;
			}

			increment /= 10;
		}
	}
	else if ( expected < tableNum )
	{
		while ( increment != 0.0001 )
		{
			while ( expected < parseFloat( presentValueAnnuity( 1, currGuess + increment, periods ).toFixed(5) ) )
			{
				currGuess += increment;
			}

			increment /= 10;
		}
	}

	return Math.round(currGuess * 100) / 100;
}

function calcPVADRate( initRate, periods, expected )
{
	var increment = 0.1;
	var currGuess = initRate;
	var tableNum = parseFloat( presentValueAnnuityDue( 1, initRate, periods ).toFixed(5) );

	if ( Math.abs( expected - tableNum ) < 0.001 )
		return initRate;
	else if ( expected > tableNum )
	{
		while ( increment != 0.0001 )
		{
			while ( expected > parseFloat( presentValueAnnuityDue( 1, currGuess - increment, periods ).toFixed(5) ) )
			{
				currGuess -= increment;
			}

			increment /= 10;
		}
	}
	else if ( expected < tableNum )
	{
		while ( increment != 0.0001 )
		{
			while ( expected < parseFloat( presentValueAnnuityDue( 1, currGuess + increment, periods ).toFixed(5) ) )
			{
				currGuess += increment;
			}

			increment /= 10;
		}
	}

	return Math.round(currGuess * 100) / 100;
}

function calcCash( face, rate, months, total )
{
	var divisor = total;
	if ( typeof total == "undefined" )
		divisor = 12;

	return face * ( rate / 100 ) * ( months / divisor );
}

function calcInstallCash( face, rate, periods )
{
	return face / presentValueAnnuity( 1, rate, periods );
}

function calcInt( carry, rate, months, total )
{
	var divisor = total;
	if ( typeof total == "undefined" )
		divisor = 12;

	return carry * ( rate / 100 ) * ( months / divisor );
}

function calcAssetValue( payments, rate, periods, bpo, ordinary )
{
	var mlp;

	if ( !ordinary )
	{
		mlp = presentValueAnnuityDue( payments, rate, periods );
		if ( typeof bpo != "undefined" && !isNaN(bpo) )
			mlp += presentValue( bpo, rate, periods );
	}
	else
	{
		mlp = presentValueAnnuity( payments, rate, periods );
		if ( typeof bpo != "undefined" && !isNaN(bpo) )
			mlp += presentValue( bpo, rate, periods + 1);
	}

	return mlp;
}

function calcPaymentValue( value, rate, periods, bpo, ordinary )
{
	var pmt = 0;
	if ( !ordinary )
	{
		if ( typeof bpo == "undefined" || isNaN(bpo) )
			pmt = value / presentValueAnnuityDue( 1, rate, periods );
		else
		{
			var paymentSum = value - presentValue( bpo, rate, periods );
			pmt = paymentSum / presentValueAnnuityDue( 1, rate, periods );
		}
	}
	else
	{
		if ( typeof bpo == "undefined" || isNaN(bpo) )
			pmt = value / presentValueAnnuity( 1, rate, periods );
		else
		{
			var paymentSum = value - presentValue( bpo, rate, periods + 1 );
			pmt = paymentSum / presentValueAnnuity( 1, rate, periods );
		}
	}

	return pmt;
}
	
function faceValuation( face, periods, mktRate, noteRate, times )
{
	return presentValue( face, mktRate / times, periods ) + presentValueAnnuity( face * ( noteRate / 100 ) / times, mktRate / times, periods );
}

// Carrying value calculations

function calcRemainingCV( face, totalPer, sincePer, noteRate, method, times, carryingValue )
{
	// index 0 = carrying value; index 1 = last interest; index 2 = last principal
	var returnArray = new Array();
	var mktRate = calcBondRate( noteRate, totalPer, face, carryingValue, times );
	var difference = carryingValue - face;
	if ( method == 0 )
	{
		// Straight Line
		var amort = difference / totalPer;
		returnArray.push( Math.round( carryingValue - ( amort * sincePer ) ));
		returnArray.push( Math.round( face * ( noteRate / 100 ) / times ));
		returnArray.push( Math.round( amort ));
	}
	else
	{
		// Effective Interest
		var cash, interest, principal;

		for ( var i = 0; i < sincePer; i++ )
		{
			cash = calcCash( face, noteRate, ( 12 / times ));
			interest = calcInt( carryingValue, mktRate / times, 12 );
			principal = interest - cash; // if positive, then premium

			carryingValue += principal;
		}

		returnArray = [ Math.round( carryingValue ), Math.round( interest ), Math.round( -1 * principal )];
	}

	return returnArray;
}

// Date Check Methods

function isDefault( dateString )
{
	var d = new Date( dateString );
	d.setMinutes( d.getMinutes() + d.getTimezoneOffset() );
	return d.getMonth() == 11 && d.getDate() == 31;
}

function isOriginal( dateString )
{
	var d = new Date( dateString );
	d.setMinutes( d.getMinutes() + d.getTimezoneOffset() );
	return d.getMonth() == 0 && d.getDate() == 1;
}