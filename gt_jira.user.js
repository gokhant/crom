// ==UserScript==
// @name					GT_JIRA
// @description		EpisodeAlert sitesindeki nzb ve torrent linklerinin yanina baska linkler eklemeyi saglar
// @version				0.1.7
// @author				Gokhan Tuna
// @include				https://jira.atlassian.com/browse/*
// @run-at				document-end
// @grant					GM_xmlhttpRequest
// ==/UserScript==


var lh = 'jira: ';
var hodo;

var taskCreation = {
    "fields": {
       "project":
       { 
          "key": "DEMO"
       },
       "summary": "REST ye merry gentlemen.",
       "description": "Creating of an issue using project keys and issue type names using the REST API",
       "issuetype": {
          "name": "New Feature"
       }
   }
};

function _log(logStr) {
	console.log(lh + logStr);
}

function addJQuery(callback) {
  var script = document.createElement("script");
  script.setAttribute("src", "//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js");
  script.addEventListener('load', function() {
    var script = document.createElement("script");
    script.textContent = "window.jQ=jQuery.noConflict(true);(" + callback.toString() + ")();";
    document.body.appendChild(script);
  }, false);
  document.body.appendChild(script);
}

// the guts of this userscript
function jqueryLoaded() {
	//_log('jQuery loaded');
	console.log('jQuery loaded, there are ' + jQ('a').length + ' links on the page');
	hodo = jQ;
  // Note, jQ replaces $ to avoid conflicts.
  //alert("There are " + jQ('a').length + " links on this page.");
}



/*
var mems = document.evaluate( '//a[contains(@href, "profile")][ not( @class = "skyblue" )]' ,document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );

left:  //*[@id="stalker"]/div/div/div/div/div[1]
right: //*[@id="stalker"]/div/div/div/div/div[2]
jira left:  //*[@id="stalker"]/div/div[2]/div/div/div[1]
jira right: //*[@id="stalker"]/div/div[2]/div/div/div[2]

curl -u admin:admin -X POST --data @data.txt -H "Content-Type: application/json" http://localhost:2990/jira/rest/api/2/issue/ 

{
    "fields": {
       "project":
       { 
          "key": "DEMO"
       },
       "summary": "REST ye merry gentlemen.",
       "description": "Creating of an issue using project keys and issue type names using the REST API",
       "issuetype": {
          "name": "New Feature"
       }
   }
}

in chrome console: $x('//*[@id="key-val"]')[0].getAttribute('rel')

<ul id="opsbar-opsbar-operations" class="toolbar-group pluggable-ops">
	<li class="toolbar-item">
		<a id="greenhopper-rapidboard-operation" title="View this issue on an Agile board" class="toolbar-trigger issueaction-greenhopper-rapidboard-operation js-rapidboard-operation-issue" href="/secure/GHGoToBoard.jspa?issueId=303848">
			<span class="trigger-label">Agile Board</span>
		</a>
	</li>
	<li class="toolbar-item toolbar-dropdown">
		<div>
			<a href="#" id="opsbar-operations_more" data-hide-on-scroll=".split-view .issue-container" data-contain-to-window="true" class="toolbar-trigger  js-default-dropdown active">
				<span class="dropdown-text">More</span>
				<span class="icon drop-menu"></span>
			</a>
			<div class="ajs-layer-placeholder">
			</div>
		</div>
	</li>
</ul>


<ul id="opsbar-opsbar-test-development" class="toolbar-group pluggable-ops">
	<li class="toolbar-item">
		<a id="test-task-creation" title="Create a related test task" class="toolbar-trigger">
			<span class="trigger-label">Create a Test Task</span>
		</a>
	</li>
	<li class="toolbar-item">
		<a id="dev-task-creation" title="Create a related dev task" class="toolbar-trigger">
			<span class="trigger-label">Create a Dev Task</span>
		</a>
	</li>
</ul>
*/
function ikspet() {
		_log('Writing details of the task');
		_log('key is      ' + extractKey());
		_log('jiraId is   ' + extractId());
		_log('priority is ' + extractPriority());
		_log('summary is  ' + extractSummary());
		_log('leftTool is ' + extractLeftToolbar());
		appendButtons();
		addClickEvents();
}

function extract(expression) {
	var result = document.evaluate(expression, document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
	return result.snapshotItem(0);
}

function extractKey() {
	return extract('//*[@id="key-val"]').textContent;
}

function extractId() {
	return extract('//*[@id="key-val"]').getAttribute('rel');
}

function extractSummary() {
	return extract('//*[@id="summary-val"]').textContent;
}

function extractPriority() {
	return extract('//*[@id="priority-val"]').textContent.trim();
}

function extractLeftToolbar() {
	return extract('//div[contains(@class, "toolbar-split-left")]');
}

function appendButtons() {
	var leftToolBar = extractLeftToolbar();
	var newChild = document.createElement("ul");
	newChild.setAttribute('id', 'opsbar-opsbar-test-development');
	newChild.setAttribute('class', 'toolbar-group pluggable-ops');
	newChild.innerHTML = 
		'<li class="toolbar-item">' + 
			'<a id="test-task-creation" title="Create a related test task" class="toolbar-trigger">' + 
				'<span class="trigger-label">Create Test</span>' + 
			'</a>' +
		'</li>' + 
		'<li class="toolbar-item">' + 
			'<a id="dev-task-creation" title="Create a related dev task" class="toolbar-trigger">' + 
				'<span class="trigger-label">Create Dev</span>' + 
			'</a>' +
		'</li>';
	leftToolBar.appendChild(newChild);
}

function createTestLinkClicked() {
	//curl -u admin:admin -X POST --data @data.txt -H "Content-Type: application/json" http://localhost:2990/jira/rest/api/2/issue/ 
	//application/x-www-form-urlencoded; charset=UTF-8
	_log(taskCreation.fields.project.key);
	GM_xmlhttpRequest ( {
		headers: {
			"Authorization" : "Basic Z29raGFudEBnbWFpbC5jb206OTYxNTA3ODY5Mg==",
    	"Content-Type"  : "application/json"
  	},
		user:						'gokhant@gmail.com',
		password:				'9615078692',
    method:         'POST',
    url:            'https://jira.atlassian.com/rest/api/2/issue/',
    data:						JSON.stringify(taskCreation), 
    onload:         function (responseDetails) {
                        _log('status:   ' + responseDetails.statusText);
                        var data = JSON.parse(responseDetails.responseText);
                        _log('errorMsg: ' + data.errorMessages);
                    }
	} );


	/*var xhr = new XMLHttpRequest();
	xhr.open("GET", "https://jira.atlassian.com/rest/api/2/issue/DEMO-2717", true);
	xhr.onreadystatechange = function() {
  	if (xhr.readyState == 4) {
    	// JSON.parse does not evaluate the attacker's scripts.
    	var resp = JSON.parse(xhr.responseText);
    	_log(resp);
  	}
	}
	xhr.send();
	*/
	
	//console.log('hodo clicked, there are ' + hodo('a').length + ' links on the page');
	/*$ajax({
  	url: "https://jira.atlassian.com/rest/api/2/issue/DEMO-2717",
  	beforeSend: function( xhr ) {
    	xhr.overrideMimeType( "text/plain; charset=x-user-defined" );
  	}
	})
  .done(function( data ) {
  	_log(data);
  	if ( console && console.log ) {
      console.log( "Sample of data:", data.slice( 0, 100 ) );
    }
  });
*/
}

function addClickEvents() {
	var createTestLink = document.getElementById('test-task-creation');
  createTestLink.addEventListener('click', createTestLinkClicked, true);
}

// load jQuery and execute the jqueryLoaded function
//addJQuery(jqueryLoaded);
// do xpath stuff
ikspet();
