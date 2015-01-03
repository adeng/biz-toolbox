<!DOCTYPE html>
<html lang="en">
	<head>
	    <meta charset="utf-8">
	    <meta name="viewport" content="width=device-width, initial-scale=1.0">
	    <meta name="author" content="Albert Deng">

	    <!-- Bootstrap core CSS -->
	    <link href="css/bootstrap.min.css" rel="stylesheet">

		<script type='text/javascript' src="js/jquery.min.js"></script>
	    <script type="text/javascript" src="js/bootstrap.min.js"></script>
	    <script type="text/javascript" src="js/bootbox.min.js"></script>
	    <script type='text/javascript' src='js/script.js'></script>

	    <link href="css/dashboard.css" rel="stylesheet">

	    <title>Accounting Generators</title>
	</head>
	<body>
		<div class="container">
			<div class="navbar navbar-inverse navbar-fixed-top" role="navigation">
				<div class="container-fluid">
					<div class="navbar-header">
						<button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
							<span class="sr-only">Toggle navigation</span>
							<span class="icon-bar"></span>
							<span class="icon-bar"></span>
							<span class="icon-bar"></span>
						</button>
						<a class="navbar-brand" href="../index.html">Accounting Toolbox</a>
					</div>
					<div class="navbar-collapse collapse">
						<ul class="nav navbar-nav">
						</ul>
						<ul class="nav navbar-nav navbar-right">
							<li class="active"><a onclick="logout();" href>Leave Feedback</a></li>
							<li><a href="#"><form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
								<input type="hidden" name="cmd" value="_s-xclick">
								<input type="hidden" name="encrypted" value="-----BEGIN PKCS7-----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-----END PKCS7-----
								"><input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif" border="0" name="submit" alt="PayPal - The safer, easier way to pay online!">
								<img alt="" border="0" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" width="1" height="1"></form></a></li>
						</ul>
					</div>
				</div>
			</div>

			<div class="col-sm-3 col-md-2 sidebar">
				<ul class="nav nav-sidebar">
					<li class="divider"><h4>Generators</h4></li>
					<li id="receivableLi"><a href="gen/ch7-120A.html">Accounts Receivable</a></li>
					<li id="noteLi"><a href="gen/ch7A-120A.html">Notes Receivable</a></li>
					<li id="investmentLi"><a href="gen/ch12-120A.html">Equity Investments</a></li>
					<li id="bondLi"><a href="gen/ch14-120B.html">Debt Securities</a></li>
					<li id="leaseLi"><a href="gen/ch15-120B.html">Leases</a></li>
					<li class="divider"><h4>Calculators</h4></li>
					<li id="pvCalcLi"><a href="calc/pvCalc.html">Present Value</a></li>
				</ul>
			</div>
		</div>

		<div class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
        	<h1 class="page-header">Leave Feedback</h1>

        	<div>
        		<?php 
        			$msg = $_POST['message'];
        			$email = $_POST['email'];

        			$validEmail = false;
        			$validMsg = false;


        			if( empty( $email ))
        				print "Please enter your email!";
        			else
        				$validEmail = true;

        			if( empty( $msg ))
        				print "Please enter a message!";
        			else
        				$validMsg = true;

        			if( $validEmail == true && $validMsg == true )
        			{
        				print "Thank you! Your message was sent successfully!";
        			}
        		?>
        	</div>
	    	<!-- /.row -->

	        <hr>

	        <!-- Footer -->
	        <footer>
	            <div class="row">
	                <div class="col-lg-12">
	                    <p>Copyright &copy; Albert Deng 2014</p>
	                </div>
	            </div>
	        </footer>
	    </div>

		<!-- Viewport size detectors -->
        <div class="device-xs visible-xs"></div>
		<div class="device-sm visible-sm"></div>
		<div class="device-md visible-md"></div>
		<div class="device-lg visible-lg"></div>
	</body>
</html>