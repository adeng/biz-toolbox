// Depreciation methods

// These methods should return an array with 
// 0: depr for period
// 1: accumulated depr
// 2: carrying value

// periodsElapsed does NOT include the current period
function straightLine( assetVal, periods, residual, periodsElapsed, monthsDepr )
{
	var pers = ( typeof periodsElapsed == "undefined" || periodsElapsed == "" ) ? 0 : periodsElapsed;
	var months = ( typeof monthsDepr == "undefined" || monthsDepr == "" ) ? 12 : monthsDepr;

	var depreciation = assetVal / periods;
	var currDepr = depreciation * ( months / 12 );
	var accumDepr = ( pers * depreciation ) + currDepr;
	var carryingVal = assetVal - accumDepr;
	
	return [ currDepr, accumDepr, carryingVal ];
}

