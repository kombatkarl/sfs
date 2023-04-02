<?php
    $lines = file_get_contents($_FILES['standingsFile']['tmp_name']);
    //$filename = $_FILES['standingsFile']['name'];
    $leaguerows = parseRows($lines);

	$lines = file_get_contents($_FILES['scheduleFile']['tmp_name']);
	$gameresultrows = parseRows($lines);
    echo json_encode([
		"league" => $leaguerows,
		"results" => $gameresultrows
	]);

    function parseRows($s) {
		$currString = $s;
		do {
			$pos = strpos($currString, "<TR>");
			$pos1 = strpos($currString, "</TR>");
			$rows[] = substr($currString, $pos, $pos1 - $pos + 4);
			$currString = substr($currString, $pos1 + 4);
		} while (strpos($currString, "<TR>"));
		return $rows;
	}

?>