
var g_oPrintX = null;
var g_aDocTree = new Object();
var g_nDispPage = -1;
var g_cLeftToPrint = 0;
var g_fPreview;
var g_nScreenDPI = 96
var g_nMarginTop = 0;
var g_nMarginBottom = 0;
var g_nMarginLeft = 0;
var g_nMarginRight = 0;
var g_nPageWidth = 0;
var g_nPageHeight = 0;
var g_strOrientation = Printer.orientation;
var g_nScalePercent = 100;
var g_fCheckAutoFit = true;
var g_fCheckOrphan = false;
var g_oOptionSTF = null;
var g_bSTF = true;
var g_bPrintBackground = false;
var g_nUnprintTop = 0;
var g_nUnprintBottom = 0;
var g_strHeader = "";
var g_strFooter = "";
var g_strHeaderFooterFont = "";
var g_fTableOfLinks = false;
var g_fPrintHeaderFooter = true;
var g_cPagesDisplayed = 0;
var g_cxDisplaySlots = 1;
var g_cyDisplaySlots = 1;
var g_imgUnderMouse = null;
var g_imgDown = null;
var g_fixPNG = null;
var g_curMultiSelect = null;
var g_curMultiPages = 1;
var g_nFramesetLayout = 0;
var g_strActiveFrame = null;
var g_nTotalPages = 0;
var g_nDocsToCalc = 0;
var g_nFramesLeft = 0;
var g_nZoomLevel = 100;
var g_zoomLayout = -2;
var g_zoomLayoutX = 1;
var g_zoomLayoutY = 1;
var g_zoomPageCount = 1;
var g_fDelayClose = false;
var g_ObsoleteBar = 0;
var g_oUserOverrideForMargins = {left:null, right:null, top:null, bottom:null};
var g_oMarginsAtPage = null;
var g_oMarginsAtPageFirst = null;
var g_oMarginsAtPageLeft = null;
var g_oMarginsAtPageRight = null;
var g_oPrintedDocument = null;
var g_nMarginIncreaseForHeader = (27 / 100);
var g_nMarginIncreaseForFooter = (27 / 100);
function WindowClose()
{
	if (g_oPrintX) {
		try {
			g_oPrintX.Printed = true;
		} catch (e) {}
	}
	window.close();
}
function AttachDialogEvents()
{
	printimg.onclick = HandlePrintClick;
	printimg.onmouseover = buttonOver;
	printimg.onmouseout = buttonOut;
	portrait.onmouseover = buttonOver;
	portrait.onmouseout = buttonOut;
	landscape.onmouseover = buttonOver;
	landscape.onmouseout = buttonOut;
	settings.onmouseover = buttonOver;
	settings.onmouseout = buttonOut;
	headerimg.onmouseover = buttonOver;
	headerimg.onmouseout = buttonOut;
	zoomWidth.onmouseover = buttonOver;
	zoomWidth.onmouseout = buttonOut;
	zoomPage.onmouseover = buttonOver;
	zoomPage.onmouseout = buttonOut;
	helpimg.onmouseover = buttonOver;
	helpimg.onmouseout = buttonOut;
	begin.onmouseover = buttonOver;
	begin.onmouseout = buttonOut;
	prev.onmouseover = buttonOver;
	prev.onmouseout = buttonOut;
	next.onmouseover = buttonOver;
	next.onmouseout = buttonOut;
	end.onmouseover = buttonOver;
	end.onmouseout = buttonOut;
	printimg.onmousedown = buttonDown;
	printimg.onmouseup = buttonUp;
	portrait.onmousedown = buttonDown;
	portrait.onmouseup = buttonUp;
	landscape.onmousedown = buttonDown;
	landscape.onmouseup = buttonUp;
	settings.onmousedown = buttonDown;
	settings.onmouseup = buttonUp;
	headerimg.onmousedown = buttonDown;
	headerimg.onmouseup = buttonUp;
	zoomWidth.onmousedown = buttonDown;
	zoomWidth.onmouseup = buttonUp;
	zoomPage.onmousedown = buttonDown;
	zoomPage.onmouseup = buttonUp;
	helpimg.onmousedown = buttonDown;
	helpimg.onmouseup = buttonUp;
	portrait.onclick = HandlePortrait;
	landscape.onclick = HandleLandscape;
	settings.onclick = HandlePageSetup;
	headerimg.onclick = HandleHeaders;
	zoomWidth.onclick = HandleZoomWidthButton;
	zoomPage.onclick = HandleZoomPageButton;
	begin.onclick = HandleFirstPage;
	prev.onclick = HandleBackPage;
	next.onclick = HandleForwardPage;
	end.onclick = HandleLastPage;
	helpimg.onclick = HandleHelp;
	document.onhelp = HandleHelp;
	begin.onmousedown = buttonDown;
	begin.onmouseup = buttonUp;
	prev.onmousedown = buttonDown;
	prev.onmouseup = buttonUp;
	next.onmousedown = buttonDown;
	next.onmouseup = buttonUp;
	end.onmousedown = buttonDown;
	end.onmouseup = buttonUp;
	inputCustomScale.onkeypress = HandleInputKeyPress;
	inputCustomScale.onchange = HandleCustomScaleSelect;
	inputPageNum.onkeypress = HandleInputKeyPress;
	inputPageNum.onchange = HandlePageSelect;
	selectScale.onchange = HandleScaleSelect;
	selectFrameset.onchange = HandleFramesetSelect;
	selectPages.onchange = HandleZoomMultiPageSelect;
	window.onresize = OnResizeBody;
	window.onerror = HandleError;
	document.body.onkeypress = OnKeyPress;
	document.body.onkeydown = OnKeyDown;
	OverflowContainer.onmousedown = HandleMarginMouseDown;
	OverflowContainer.onmouseup = HandleMarginMouseUp;
	OverflowContainer.onmousemove = HandleMarginMouseMove;
	window.onfocus = new Function("MasterContainer.focus()");
}
function GetRuleFromSelector(strSelector)
{
	var i;
	var oRule;
	var oSS = document.styleSheets[0];
	var len;
	try {
		len = oSS.rules.length;
	} catch (e) {
		var L_Invalid_Text = e.description + "\r\n\r\n建议IEPrintX网页打印控件安装在Windows的System32目录下！";
		alert(L_Invalid_Text);
		WindowClose();
	}
	for (i = 0; i < len; i++)
	{
		oRule = oSS.rules[i];
		if (oRule == null || oRule.selectorText == strSelector)
		{
			break;
		}
		else
		{
			oRule = null;
		}
	}
	return oRule;
}
function UnprintableURL(strLink)
{
	var fUnprintable = false;
	var cIndex = strLink.indexOf(":");
	switch (cIndex)
	{
	case 4:
		if (strLink.substr(0, cIndex) == "news")
		{
			fUnprintable = true;
		}
		break;
	case 5:
		if (strLink.substr(0, cIndex) == "snews")
		{
			fUnprintable = true;
		}
		break;
	case 6:
		if ( strLink.substr(0, cIndex) == "telnet" || strLink.substr(0, cIndex) == "mailto")
		{
			fUnprintable = true;
		}
		break;
	case 8:
		if (strLink.substr(0,cIndex) == "vbscript")
		{
			fUnprintable = true;
		}
		break;
	case 10:
		if (strLink.substr(0,cIndex) == "javascript")
		{
			fUnprintable = true;
		}
		break;
	}
	return fUnprintable;
}
function OnKeyPress()
{
	if (event.keyCode == 27)
	{
		Close();
	}
}
function OnKeyDown()
{
	if(event.keyCode==13 && event.srcElement && (event.srcElement.id=="OverflowContainer" || event.srcElement.id=="MasterContainer"))
	{
		event.cancelBubble = true;
		return false;
	}
	if (event.altKey)
	{
		switch (event.keyCode)
		{
		case 37:
			if (document.body.dir=="rtl")
			{
				ChangeDispPage(g_nDispPage+1);
			}
			else
			{
				ChangeDispPage(g_nDispPage-1);
			}
			break;
		case 39:
			if (document.body.dir=="rtl")
			{
				ChangeDispPage(g_nDispPage-1);
			}
			else
			{
				ChangeDispPage(g_nDispPage+1);
			}
			break;
		case 35:
			HandleLastPage();
			break;
		case 36:
			HandleFirstPage();
			break;
		case 50: '2'
		case 98: '2'
			selectPages.selectedIndex = 1;
			HandleZoomMultiPageClick(2);
			break;
		case 51: '3'
		case 99: '3'
			selectPages.selectedIndex = 2;
			HandleZoomMultiPageClick(3);
			break;
		case 54: '6'
		case 102: '6'
			selectPages.selectedIndex = 3;
			HandleZoomMultiPageClick(6);
			break;
		case 67: 'C'
			Close();
			break;
		case 48: '0'
		case 96: '0'
			selectPages.selectedIndex = 4;
			HandleZoomMultiPageClick(12);
			break;
		default:
			return;
		}
		event.cancelBubble = true;
		return false;
	}
}
function OnLoadBody()
{
	try {
		if (dialogArguments.__IE_BrowseDocument)
		{
			g_oPrintedDocument = dialogArguments.__IE_BrowseDocument;
			g_oPrintX = g_oPrintedDocument.all.PrintX;
		}
	} catch (e) {}
	g_fPreview = dialogArguments.__IE_PrintType == "Preview";
	if (UnprintableURL(dialogArguments.__IE_ContentDocumentUrl))
	{
		// "Unable to print URL. Please navigate directly to this page and select Print.";
		var L_Invalid_Text = "不能直接打印当前网页，请选择需要打印内容之后再打印。";
		alert(L_Invalid_Text);
		window.close();
	}
	if (!g_oPrintX)
	{
		var L_Invalid_Text = "IEPrintX网页打印控件Id名称必须是PrintX！";
		alert(L_Invalid_Text);
		window.close();
	}
	g_oPrintX.Printed = false;
	LoadOptions();
	UpdateOrientationButtons();
	ChangeZoom();
	if (dialogArguments.__IE_HeaderString)
	{
		Printer.header = dialogArguments.__IE_HeaderString
	}
	if (dialogArguments.__IE_FooterString)
	{
		Printer.footer = dialogArguments.__IE_FooterString
	}
	if (!g_oPrintX.PrintHeaderFooter)
	{
		HandleHeaders();
	}
	EnsureDocuments(false);
	window.document.body.style.cursor="wait";
	if (g_fCheckAutoFit) g_fCheckAutoFit = (dialogArguments.__IE_STFScaleMin != 100);
	g_fCheckOrphan = true;
	if (!dialogArguments.__IE_ShrinkToFit)
	{
		g_fCheckAutoFit = false;
		g_bSTF = false;
		g_oOptionSTF = selectScale.options[0];
		selectScale.options.remove(0);
		selectScale.selectedIndex = 8;
	}
	if (dialogArguments.__IE_PrintBackground || g_oPrintX.PrintBackground)
	{
		g_bPrintBackground = true;
	}
	if (!CreateDocumentFromPrintId())
	{
		CreateDocument("document", "C", true);
	}
	if (g_oPrintedDocument == null)
	{
		EnsureDocuments(false);
	}
	ChangeDispPage(1);
	g_nFramesLeft = 1;
	OnBuildAllFrames("C");
	if (g_fPreview)
	{
		if(dialogArguments.__IE_ContentSelectionUrl)
		{
			CreateDocument(dialogArguments.__IE_ContentSelectionUrl, "S", true);
		}
		AttachDialogEvents();
		OverflowContainer.style.top = idDivToolbar.offsetHeight;
		var h = document.body.clientHeight - idDivToolbar.offsetHeight - idDivToolbar2.offsetHeight;
		if(h<0) h = 0;
		OverflowContainer.style.height = h;
		idDivToolbar2.style.visibility = "visible";
		idDivToolbar2.style.pixelTop = idDivToolbar.offsetHeight + h;
		ChangeZoomSpecial(g_zoomLayout);
	}
	else
	{
		PrintNow(dialogArguments.__IE_PrintType == "Prompt");
	}
}
function LoadOptions()
{
	// ActiveX: DotMatrix; DEVMODE: Printer, PaperSize, PaperSource, Collate, Duplex, Color, Quality
	// Other options: PaperLength, PaperWidth, PageRange
	// ScriptOptions: DocumentName, Orientation, PrintId, Scale, Copies, MarginLeft, MarginRight, MarginTop, MarginBottom, PreviewZoom, PrintBackground, PrintHeaderFooter
	var nVal = g_oPrintX.Orientation;
	if (1 == nVal) Printer.orientation = "portrait";
	else if (2 == nVal) Printer.orientation = "landscape";
	Printer.copies = Max(g_oPrintX.Copies, 1);
	if (g_oPrintX.Scale > 0 && g_oPrintX.Scale != 100)
	{
		g_fCheckAutoFit = false;
		g_nScalePercent = g_oPrintX.Scale;
		var iLen = selectScale.options.length - 1;
		for (var i = 1; i < iLen; ++i)
		{
			if (g_nScalePercent == parseInt(selectScale.options[i].value))
			{
				selectScale.selectedIndex = i;
				break;
			}
		}
		if (i >= iLen)
		{
			selectScale.selectedIndex = iLen;
		}
		HandleScaleSelect();
	}
	Printer.marginLeft = Max(CmToInch(g_oPrintX.MarginLeft), Printer.unprintableLeft);
	Printer.marginRight = Max(CmToInch(g_oPrintX.MarginRight), Printer.unprintableRight);
	Printer.marginTop = Max(CmToInch(g_oPrintX.MarginTop), Printer.unprintableTop);
	Printer.marginBottom = Max(CmToInch(g_oPrintX.MarginBottom), Printer.unprintableBottom);
	if (g_oPrintX.PreviewZoom > 0) g_nZoomLevel = g_oPrintX.PreviewZoom;
	g_oPrintX.PrintSetup("lOAD");
}
function DumpOptions()
{
	var nVal = Printer.orientation;
	if ("portrait" == nVal) g_oPrintX.Orientation = 1;
	else if ("landscape" == nVal) g_oPrintX.Orientation = 2;
	g_oPrintX.PaperLength = Printer.pageHeight;
	g_oPrintX.PaperWidth = Printer.pageWidth;
	g_oPrintX.Scale = IsShrinkToFit() ? -1 : g_nScalePercent;
	g_oPrintX.MarginLeft = InchToCm(Printer.marginLeft);
	g_oPrintX.MarginRight = InchToCm(Printer.marginRight);
	g_oPrintX.MarginTop = InchToCm(Printer.marginTop);
	g_oPrintX.MarginBottom = InchToCm(Printer.marginBottom);
	g_oPrintX.PreviewZoom = g_nZoomLevel;
	g_oPrintX.PrintSetup("dUMP");
}
function Max(x, y)
{
	return Math.max(x, y);
}
function CmToInch(nCm)
{
	return Math.round(nCm / 2.54);
}
function InchToCm(nInch)
{
	return Math.round(nInch * 2.54);
}
function CreateDocumentFromPrintId()
{
	var printId = g_oPrintedDocument.all(g_oPrintX.PrintId);
	if (!printId) return false;
	var oNode, aColl, oItem, i;
	var oHead = document.createElement("HEAD");

	oNode = document.createElement("META");
	oNode.content = "text/html; charset=" + g_oPrintedDocument.charset;
	oNode.httpEquiv = "Content-Type";
	oHead.appendChild(oNode);

	var oStyle = g_oPrintedDocument.getElementsByTagName("HEAD").item(0);
	if (g_oPrintedDocument.parentWindow.getComputedStyle) {
		oStyle = g_oPrintedDocument.parentWindow.getComputedStyle(oStyle, null);
	} else {
		oStyle = oStyle.currentStyle;
	}
	if (oStyle && oStyle.fontFamily) {
		oNode = oHead.document.createStyleSheet();
		oNode.cssText = "HTML {font-family: \"" + oStyle.fontFamily + "\"}";
	}

	var sUrl = g_oPrintedDocument.URL || g_oPrintedDocument.URLUnencoded;
	if (sUrl)
	{
		oNode = document.createElement("BASE");
		oNode.href = sUrl;
		oHead.appendChild(oNode);
	}

	aColl = g_oPrintedDocument.getElementsByTagName("META");
	for (i = 0; i < aColl.length; ++i)
	{
		oItem = aColl.item(i);
		oNode = document.createElement("META");
		if(oItem.httpEquiv) oNode.httpEquiv = oItem.httpEquiv;
		if(oItem.name) oNode.name = oItem.name;
		if(oItem.content) oNode.content = oItem.content;
		if(oItem.scheme) oNode.scheme = oItem.scheme;
		if(oItem.charset) oNode.charset = oItem.charset;
		oHead.appendChild(oNode);
	}

	oNode = document.createElement("TITLE");
	oNode.innerText = (g_oPrintX.DocumentName || g_oPrintedDocument.title);
	oHead.appendChild(oNode);

	aColl = g_oPrintedDocument.styleSheets;
	for (i = 0; i < aColl.length; ++i)
	{
		oItem = aColl.item(i);
		if (oItem.href)
		{
			oNode = oHead.document.createStyleSheet(oItem.href);
		}
		else
		{
			oNode = oHead.document.createStyleSheet();
			oNode.cssText = oItem.cssText;
		}
		if(oItem.id) oNode.id = oItem.id;
		if(oItem.media) {
			var media = oItem.media.mediaText || oItem.media;
			if (media && media != "all") {
				oNode.media = media;
			}
		}
		if(oItem.title) oNode.title = oItem.title;
		if(oItem.disabled) oNode.disabled = oItem.disabled;
	}

	try {
		oHead.document.charset = "utf-8";
	} catch (e) {
		var L_Invalid_Text = "试图解析网页字符发生错误，请正确设置网页的charset属性：\r\n\r\n<meta http-equiv=\"Content-Type\" content=\"text/html; charset="
			+ g_oPrintedDocument.charset + "\" />";
		alert(L_Invalid_Text);
		WindowClose();
	}

	var sDocType = g_oPrintedDocument.doctype;
	if (!sDocType) {
		sDocType = "<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 4.0 Transitional//EN\">";
	} else if (sDocType.systemId) {
		sDocType = "<!DOCTYPE " + sDocType.name + " PUBLIC \"" + sDocType.publicId + "\" \"" + sDocType.systemId + "\">";
	}
	sUrl = g_oPrintX.PrintSetup("tEMP" + sDocType + "\r\n<HTML __IE_DisplayURL=\""
		+ (dialogArguments.__IE_DisplayUrl || sUrl) + "\">\r\n" + oHead.outerHTML + "\r\n<BODY>\r\n" + printId.outerHTML + "\r\n</BODY>\r\n</HTML>\r\n");
	if (sUrl && sUrl.length > 0)
	{
		CreateDocument("file://" + sUrl, "C", true);
		return true;
	}
	return false;
}
function BuildAllFramesComplete()
{
	window.document.body.style.cursor="auto";
	UpdateFramesetSelect();
}
function CalcDocsComplete()
{
	if (g_nFramesetLayout == 2)
	{
		ChangeFramesetLayout(g_nFramesetLayout, true)
	}
	if(g_fCheckAutoFit)
	{
		g_fCheckAutoFit = false;
		var fitScale = CalcAutoFit();
		if (fitScale < dialogArguments.__IE_STFScaleMin) fitScale = dialogArguments.__IE_STFScaleMin;
		if(fitScale < 30) fitScale = 30;
		selectScale.selectedIndex = 0;
		cellCustomScale.style.display = "none";
		g_nScalePercent = fitScale;
		if(fitScale!=100 )
		{
			EnsureDocuments(true);
			return;
		}
	}
	if (g_fCheckOrphan)
	{
		g_fCheckOrphan = false;
		if(IsOrphaned())
		{
			var orphanScale = CalcOrphanRemovalScale();
			g_nScalePercent = g_nScalePercent * orphanScale/100;
			if(g_nScalePercent < 30) g_nScalePercent = 30;
			EnsureDocuments(true);
			return;
		}
	}
	ChangeDispPage(g_nDispPage);
	ChangeZoomSpecial(g_zoomLayout);
}
function OnResizeBody()
{
	OverflowContainer.style.top = idDivToolbar.offsetHeight;
	var h = document.body.clientHeight - idDivToolbar.offsetHeight - idDivToolbar2.offsetHeight;
	if(h<0) h = 0;
	OverflowContainer.style.height = h;
	idDivToolbar2.style.visibility = "visible";
	idDivToolbar2.style.pixelTop = idDivToolbar.offsetHeight + h;
	ChangeZoomSpecial(g_zoomLayout);
	PositionPages(g_nDispPage);
}
function HandleError(message, url, line)
{
	// "There was an internal error, and Internet Explorer is unable to print this document.";
	var L_Internal_ErrorMessage = "发生内部错误，IE浏览器不能打印当前文档。\r\n\r\nError: " + message + "\r\nLine: " + line;
	if (url && url.indexOf("/preview.js") < 0)
	{
		L_Internal_ErrorMessage += "\r\nURL: " + url;
	}
	alert(L_Internal_ErrorMessage);
	WindowClose();
	return true;
}
function OnRectComplete(strDoc, ObsoleteCookie)
{
	if (!g_aDocTree[strDoc])
	{
		HandleError("Document " + strDoc + " does not exist.", document.URL, "OnRectComplete");
		return;
	}
	window.setTimeout("OnRectCompleteNext('" + strDoc + "', " + event.contentOverflow + ",'" + event.srcElement.id + "'," + ObsoleteCookie + ");", 25);
}
function OnRectCompleteNext( strDoc, fOverflow, strElement, ObsoleteCookie)
{
	if (ObsoleteCookie == g_ObsoleteBar)
	{
		g_aDocTree[strDoc].RectComplete(fOverflow, strElement);
	}
}
function getVersion()
{
	var arVersion = navigator.appVersion.split("MSIE");
	return parseFloat(arVersion[1]);
}
var g_nVersion = getVersion();
function fixPNG(img)
{
	if (null == g_fixPNG) {
		if (g_nVersion < 7.0 && document.body.filters) {
			g_fixPNG = true;
		} else {
			g_fixPNG = false;
		}
	}
	if (g_fixPNG) {
		var sizingMethod = ((img.className.toLowerCase().indexOf("scale") >= 0) ? "scale" : "image");
		img.runtimeStyle.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + img.src + "', sizingMethod='" + sizingMethod + "')";
	}
}
function enableButton(img)
{
	var imgname = img.id;
	if (img == begin || img == end || img == prev || img == next)
	{
		imgname = img.value;
	}
	img.disabled = false;
	if (g_imgUnderMouse == img)
	{
		if(g_imgDown==img)
		{
			img.src = imgname + "_down.png";
		}
		else
		{
			img.src = imgname + "_hover.png";
		}
	}
	else
	{
		img.src = imgname + ".png";
	}
	fixPNG(img);
}
function disableButton(img)
{
	var imgname = img.id;
	if (img == begin || img == end || img == prev || img == next)
	{
		imgname = img.value;
	}
	img.disabled = true;
	img.src = imgname + "_disabled.png";
	fixPNG(img);
}
function updateNavButtons()
{
	if (g_nDispPage == 1)
	{
		disableButton(begin);
		disableButton(prev);
	}
	else
	{
		enableButton(begin);
		enableButton(prev);
	}
	if (TotalDisplayPages() - g_nDispPage < g_cxDisplaySlots * g_cyDisplaySlots)
	{
		disableButton(next);
		disableButton(end);
	}
	else
	{
		enableButton(next);
		enableButton(end);
	}
}
function UpdateOrientationButtons()
{
	if (g_strOrientation != Printer.orientation)
	{
		g_strOrientation = Printer.orientation;
	}
	if (g_strOrientation == "portrait")
	{
		disableButton(portrait);
		enableButton(landscape);
	}
	else
	{
		disableButton(landscape);
		enableButton(portrait);
	}
}
function buttonOver()
{
	var imgSrc = event.srcElement;
	if(imgSrc.disabled) return;
	g_imgUnderMouse = imgSrc;
	if (imgSrc == begin || imgSrc == prev || imgSrc == next || imgSrc == end)
	{
		updateNavButtons();
	}
	else
	{
		if(g_imgDown==imgSrc)
		{
			imgSrc.src= "" + imgSrc.id + "_down.png";
		}
		else
		{
			imgSrc.src= "" + imgSrc.id + "_hover.png";
		}
		fixPNG(imgSrc);
	}
}
function buttonOut()
{
	var imgSrc = event.srcElement;
	if(imgSrc.disabled) return;
	g_imgUnderMouse = null;
	if (imgSrc == begin || imgSrc == prev || imgSrc == next || imgSrc == end)
	{
		updateNavButtons();
	}
	else
	{
		imgSrc.src= "" + imgSrc.id + ".png";
		fixPNG(imgSrc);
	}
}
function buttonDown()
{
	if(event.button!=1) return;
	var imgSrc = event.srcElement;
	if(imgSrc.disabled) return;
	var imgname = imgSrc.id;
	if (imgSrc == begin || imgSrc == end || imgSrc == next || imgSrc == prev)
	{
		imgname = imgSrc.value;
	}
	imgSrc.src= "" + imgname + "_down.png";
	fixPNG(imgSrc);
	g_imgDown = imgSrc;
	g_imgDown.setCapture();
}
function buttonUp()
{
	if(event.button!=1) return;
	var imgSrc = event.srcElement;
	if(imgSrc.disabled) return;
	if(g_imgDown!=null) {
		var imgname = g_imgDown.id;
		if (g_imgDown == begin || g_imgDown == end || g_imgDown == next || g_imgDown == prev)
		{
			imgname = g_imgDown.value;
		}
		if(g_imgUnderMouse==g_imgDown)
		{
			g_imgDown.src= "" + imgname + "_hover.png";
		}
		else
		{
			g_imgDown.src= "" + imgname + ".png";
		}
		fixPNG(g_imgDown);
		g_imgDown.releaseCapture();
		g_imgDown = null;
	}
}
function HandlePageSelect()
{
	event.srcElement.value = ChangeDispPage(parseInt(inputPageNum.value));
	MasterContainer.focus();
}
function HandleCustomScaleSelect()
{
	var scale = parseInt(inputCustomScale.value);
	if(isNaN(scale)) scale = 100;
	if (scale < 30)
	{
		scale = 30;
	}
	if (scale > 999)
	{
		scale = 999;
	}
	inputCustomScale.value = scale;
	if(g_nScalePercent!=scale)
	{
		g_nScalePercent = scale;
		EnsureDocuments(true);
	}
	MasterContainer.focus();
}
function HandleInputKeyPress()
{
	var keyStroke = event.keyCode;
	if (keyStroke == 13)
	{
		event.srcElement.onchange();
		return false;
	}
	else if (keyStroke < 48 || keyStroke > 57)
	{
		event.returnValue = false;
	}
}
function HandleScaleSelect()
{
	var oldScale = g_nScalePercent;
	g_nScalePercent = parseInt(selectScale.options[selectScale.selectedIndex].value);
	g_fCheckAutoFit = false;
	g_fCheckOrphan = false;
	if (g_nScalePercent == (-1))
	{
		g_nScalePercent = 100;
		g_fCheckAutoFit = true;
		g_fCheckOrphan = true;
		cellCustomScale.style.display = "none";
		EnsureDocuments(true);
	}
	else if(g_nScalePercent == (0))
	{
		g_nScalePercent = oldScale;
		cellCustomScale.style.display = "block";
		inputCustomScale.value = oldScale;
		inputCustomScale.select();
	}
	else
	{
		cellCustomScale.style.display = "none";
		EnsureDocuments(true);
	}
	printimg.scrollIntoView();
}
function HandlePageSetup()
{
	if (Printer.showPageSetupDialog())
	{
		g_oUserOverrideForMargins.left = Printer.marginLeft / 100;
		g_oUserOverrideForMargins.right = Printer.marginRight / 100;
		g_oUserOverrideForMargins.top = Printer.marginTop / 100;
		g_oUserOverrideForMargins.bottom = Printer.marginBottom / 100;
		UpdateOrientationButtons();
		if (dialogArguments.__IE_ShrinkToFit)
		{
			if (!g_bSTF)
			{
				selectScale.options.add(g_oOptionSTF, 0);
				selectScale.selectedIndex = 0;
				g_oOptionSTF = null;
			}
		}
		else
		{
			if (g_bSTF)
			{
				g_oOptionSTF = selectScale.options[0];
				selectScale.options.remove(0);
				selectScale.selectedIndex = 8;
				HandleScaleSelect();
			}
		}
		var bPSBackground = dialogArguments.__IE_PrintBackground;
		if (bPSBackground != g_bPrintBackground)
		{
			g_bPrintBackground = bPSBackground;
			for (i in g_aDocTree)
			{
				g_aDocTree[i]._aaRect[1][0].contentDocument.updateSettings();
			}
		}
		if (IsShrinkToFit())
		{
			g_nScalePercent = 100;
			g_fCheckAutoFit = true;
			g_fCheckOrphan = true;
			EnsureDocuments(true);
		}
		else
		{
			EnsureDocuments(false);
		}
	}
}
function HandleHelp()
{
	var w = Math.floor(document.body.offsetWidth*0.75);
	var h = Math.floor(document.body.offsetHeight*0.75);
	window.open("http://go.microsoft.com/fwlink/?LinkId=127847","_blank","scrollbars=yes,width="+w+",height="+h);
	event.cancelBubble = true;
	return false;
}
function HandleForwardPage()
{
	ChangeDispPage(g_nDispPage + 1);
}
function HandleBackPage()
{
	ChangeDispPage(g_nDispPage - 1);
}
function HandleFirstPage()
{
	ChangeDispPage(1);
}
function HandleLastPage()
{
	ChangeDispPage(TotalDisplayPages());
}
function HandleHeaders()
{
	g_fPrintHeaderFooter = !g_fPrintHeaderFooter;
	var oRule = GetRuleFromSelector(".divHead");
	if (oRule == null)
	{
		HandleError("'.divHead' rule does not exist!", document.URL, "HandleHeaders()");
	}
	oRule.style.display = g_fPrintHeaderFooter ? "inline" : "none";
	oRule = GetRuleFromSelector(".divFoot");
	if (oRule == null)
	{
		HandleError("'.divFoot' rule does not exist!", document.URL, "HandleHeaders()");
	}
	oRule.style.display = g_fPrintHeaderFooter ? "inline" : "none";
}
function HandleLandscape()
{
	HandleOrient(false);
}
function HandlePortrait()
{
	HandleOrient(true);
}
function HandleOrient(fPortrait)
{
	var newOrient;
	if (fPortrait)
	{
		newOrient = "portrait";
	}
	else
	{
		newOrient = "landscape";
	}
	if(newOrient==g_strOrientation) return;
	g_strOrientation = newOrient;
	var ml = Printer.marginLeft;
	var mr = Printer.marginRight;
	var mt = Printer.marginTop;
	var mb = Printer.marginBottom;
	Printer.orientation = g_strOrientation;
	Printer.marginLeft = mt;
	Printer.marginRight = mb;
	Printer.marginTop = ml;
	Printer.marginBottom = mr;
	UpdateOrientationButtons();
	ReflowDocument();
}
function HandleFramesetSelect()
{
	UndisplayPages();
	var newFramesetLayout = parseInt(selectFrameset.options[selectFrameset.selectedIndex].value);
	var isShrinkToFit = IsShrinkToFit();
	if (isShrinkToFit)
	{
		g_nScalePercent = 100;
		g_fCheckAutoFit = true;
		g_fCheckOrphan = true;
	}
	ChangeFramesetLayout(newFramesetLayout, false);
	if (isShrinkToFit)
	{
		EnsureDocuments(true);
	}
	printimg.scrollIntoView();
}
function HandleZoomWidthButton()
{
	ChangeZoomSpecial(-1);
	g_zoomPageCount = 1;
	selectPages.selectedIndex = 0;
}
function HandleZoomPageButton()
{
	ChangeZoomSpecial(-2);
	g_zoomPageCount = 1;
	selectPages.selectedIndex = 0;
}
function getLeft(elm)
{
	if(elm==null)
	{
		return 0;
	}
	else
	{
		var sz = getLeft(elm.offsetParent);
		return sz + elm.offsetLeft;
	}
}
function getTop(elm)
{
	if(elm==null)
	{
		return 0;
	}
	else
	{
		var sz = getTop(elm.offsetParent);
		return sz + elm.offsetTop;
	}
}
function HandleZoomMultiPageSelect()
{
	g_zoomPageCount = parseInt(selectPages.options[selectPages.selectedIndex].value);
	UpdateZoomMultiPage();
}
function HandleZoomMultiPageClick(pageCount)
{
	g_zoomPageCount = pageCount;
	UpdateZoomMultiPage();
}
function UpdateZoomMultiPage()
{
	switch(g_zoomPageCount)
	{
	case 2:
		HandleZoomMultiPage(2,1);
		break;
	case 3:
		HandleZoomMultiPage(3,1);
		break;
	case 6:
		HandleZoomMultiPage(3,2);
		break;
	case 12:
		HandleZoomMultiPage(4,3);
		break;
	default:
		ChangeZoomSpecial(-2);
		break;
	}
	printimg.scrollIntoView();
}
function HandleZoomMultiPage(x,y)
{
	g_zoomLayoutX = x;
	g_zoomLayoutY = y;
	ChangeZoomSpecial(0);
}
function HandlePrintClick()
{
	PrintNow(true);
}
var g_sMarginItemID;
var g_nMarginStartingPos;
var g_nMarginImageOffset;
var g_nMarginLowerLimit;
var g_nMarginUpperLimit;
function HandleMarginMouseDown()
{
	if(event.button!=1) return;
	if(g_zoomLayout!=-2) return;
	var posX = event.x;
	var posY = event.y;
	if(g_nDispPage <= 0) return;
	var oPage = DisplayPage(g_nDispPage);
	if(null == oPage) return;
	var pageOffsetX;
	var pageOffsetY = oPage.style.pixelTop;
	pageOffsetX = oPage.style.pixelLeft;
	var xPageWidth = getPageWidth();
	var yPageHeight = getPageHeight();
	switch(event.srcElement.id)
	{
	case "maLeft":
		g_nMarginStartingPos = posX;
		g_nMarginImageOffset = maLeft.offsetLeft - posX;
		g_nMarginLowerLimit = (pageOffsetX * g_nZoomLevel/100) - 10;
		g_nMarginUpperLimit = g_nMarginLowerLimit + ((xPageWidth - ((g_nMarginRight+0.5)*g_nScreenDPI)) * g_nZoomLevel/100);
		break;
	case "maRight":
		g_nMarginStartingPos = posX;
		g_nMarginImageOffset = maRight.offsetLeft - posX;
		g_nMarginLowerLimit = (pageOffsetX * g_nZoomLevel/100) - 10;
		g_nMarginUpperLimit = g_nMarginLowerLimit + (xPageWidth * g_nZoomLevel/100);
		g_nMarginLowerLimit += ((g_nMarginLeft+0.5)*g_nScreenDPI) * g_nZoomLevel/100;
		break;
	case "maTop":
		g_nMarginStartingPos = posY;
		g_nMarginImageOffset = maTop.offsetTop - posY;
		g_nMarginLowerLimit = (pageOffsetY * g_nZoomLevel/100) - 10;
		g_nMarginUpperLimit = g_nMarginLowerLimit + ((yPageHeight - ((g_nMarginBottom+0.5)*g_nScreenDPI)) * g_nZoomLevel/100);
		break;
	case "maBottom":
		g_nMarginStartingPos = posY;
		g_nMarginImageOffset = maBottom.offsetTop - posY;
		g_nMarginLowerLimit = (pageOffsetY * g_nZoomLevel/100) - 10;
		g_nMarginUpperLimit = g_nMarginLowerLimit + (yPageHeight * g_nZoomLevel/100);
		g_nMarginLowerLimit += ((g_nMarginTop+0.5)*g_nScreenDPI) * g_nZoomLevel/100;
		break;
	default:
		return;
	}
	g_sMarginItemID = event.srcElement.id;
	UpdateMarginBox();
	OverflowContainer.setCapture();
}
function ReflowDocument()
{
	if(IsShrinkToFit())
	{
		g_nScalePercent = 100;
		g_fCheckAutoFit = true;
		g_fCheckOrphan = true;
	}
	EnsureDocuments(true);
}
function IsShrinkToFit()
{
	return parseInt(selectScale.options[selectScale.selectedIndex].value) == (-1);
}
function UpdateMarginBox()
{
	MarginBox.style.pixelLeft = maLeft.style.pixelLeft + 10;
	MarginBox.style.pixelWidth = maRight.style.pixelLeft - maLeft.style.pixelLeft;
	MarginBox.style.pixelTop = maTop.style.pixelTop + 10;
	MarginBox.style.pixelHeight = maBottom.style.pixelTop - maTop.style.pixelTop;
	MarginBox.style.display = "block";
}
function HandleMarginMouseUp()
{
	if(g_sMarginItemID==null) return;
	if(((g_sMarginItemID=="maLeft" || g_sMarginItemID=="maRight") && g_nMarginStartingPos==event.x)
		|| ((g_sMarginItemID=="maTop" || g_sMarginItemID=="maBottom") && g_nMarginStartingPos==event.y))
	{
		g_sMarginItemID = null;
		MarginBox.style.display = "none";
		OverflowContainer.releaseCapture();
		return;
	}
	var posX = event.x + g_nMarginImageOffset + 10;
	var posY = event.y + g_nMarginImageOffset + 10;
	posX *= 100/g_nZoomLevel;
	posY *= 100/g_nZoomLevel;
	var oPage = DisplayPage(g_nDispPage);
	var pageOffsetX;
	var pageOffsetY = oPage.style.pixelTop;
	var xPageWidth = getPageWidth();
	var yPageHeight = getPageHeight();
	var fReflow = false;
	var limit;
	pageOffsetX = oPage.style.pixelLeft;
	switch(g_sMarginItemID)
	{
	case "maLeft":
		var newLeft = Math.floor((posX - pageOffsetX) * 100 / g_nScreenDPI);
		limit = Printer.pageWidth - Printer.marginRight - 50;
		if(newLeft > limit) newLeft = limit;
		if(newLeft<0) newLeft = 0;
		if(Printer.marginLeft!=newLeft)
		{
			Printer.marginLeft = newLeft;
			g_oUserOverrideForMargins.left = newLeft / 100;
			g_oUserOverrideForMargins.right = g_nMarginRight;
			g_oUserOverrideForMargins.top = g_nMarginTop;
			g_oUserOverrideForMargins.bottom = g_nMarginBottom;
			fReflow = true;
		}
		break;
	case "maRight":
		var newRight = Math.floor((pageOffsetX + xPageWidth - posX) * 100 / g_nScreenDPI);
		limit = Math.floor((g_nPageWidth-g_nMarginLeft-0.5)*100);
		if(newRight > limit) newRight = limit;
		if(newRight<0) newRight = 0;
		if(Printer.marginRight!=newRight)
		{
			Printer.marginRight = newRight;
			g_oUserOverrideForMargins.left = g_nMarginLeft;
			g_oUserOverrideForMargins.right = newRight / 100;
			g_oUserOverrideForMargins.top = g_nMarginTop;
			g_oUserOverrideForMargins.bottom = g_nMarginBottom;
			fReflow = true;
		}
		break;
	case "maTop":
		var newTop = Math.floor((posY - pageOffsetY) * 100 / g_nScreenDPI);
		limit = Math.floor((g_nPageHeight-g_nMarginBottom-0.5)*100);
		if(newTop > limit) newTop = limit;
		if(newTop<0) newTop = 0;
		if(Printer.marginTop != newTop)
		{
			Printer.marginTop = newTop;
			g_oUserOverrideForMargins.left = g_nMarginLeft;
			g_oUserOverrideForMargins.right = g_nMarginRight;
			g_oUserOverrideForMargins.top = newTop / 100;
			g_oUserOverrideForMargins.bottom = g_nMarginBottom;
			fReflow = true;
		}
		break;
	case "maBottom":
		var newBottom = Math.floor((pageOffsetY + yPageHeight - posY) * 100 / g_nScreenDPI);
		if(newBottom<0) newBottom = 0;
		limit = Math.floor((g_nPageHeight-g_nMarginTop-0.5)*100);
		if(newBottom > limit) newBottom = limit;
		if(Printer.marginBottom != newBottom)
		{
			Printer.marginBottom = newBottom;
			g_oUserOverrideForMargins.left = g_nMarginLeft;
			g_oUserOverrideForMargins.right = g_nMarginRight;
			g_oUserOverrideForMargins.top = g_nMarginTop;
			g_oUserOverrideForMargins.bottom = newBottom / 100;
			fReflow = true;
		}
		break;
	}
	if(fReflow)
	{
		ReflowDocument();
	}
	else
	{
		PositionPages(g_nDispPage);
	}
	g_sMarginItemID = null;
	MarginBox.style.display = "none";
	OverflowContainer.releaseCapture();
}
function HandleMarginMouseMove()
{
	if(g_sMarginItemID==null) return;
	var posX = event.x + g_nMarginImageOffset;
	var posY = event.y + g_nMarginImageOffset;
	switch(g_sMarginItemID)
	{
	case "maLeft":
		if(posX < g_nMarginLowerLimit) posX = g_nMarginLowerLimit;
		if(posX > g_nMarginUpperLimit) posX = g_nMarginUpperLimit;
		maLeft.style.left = posX;
		break;
	case "maRight":
		if(posX < g_nMarginLowerLimit) posX = g_nMarginLowerLimit;
		if(posX > g_nMarginUpperLimit) posX = g_nMarginUpperLimit;
		maRight.style.left = posX;
		break;
	case "maTop":
		if(posY < g_nMarginLowerLimit) posY = g_nMarginLowerLimit;
		if(posY > g_nMarginUpperLimit) posY = g_nMarginUpperLimit;
		maTop.style.top = posY;
		break;
	case "maBottom":
		if(posY < g_nMarginLowerLimit) posY = g_nMarginLowerLimit;
		if(posY > g_nMarginUpperLimit) posY = g_nMarginUpperLimit;
		maBottom.style.top = posY;
		break;
	}
	UpdateMarginBox();
}
function UpdateFramesetSelect()
{
	if(g_aDocTree["S"]==null)
	{
		selectFrameset.options.remove(3);
	}
	if ( g_aDocTree["C"]._fFrameset )
	{
		if (!g_strActiveFrame)
		{
			selectFrameset.options.remove(1);
		}
		separatorFrameset.style.display = "inline";
		cellFrameset.style.display = "inline";
	}
	if(g_aDocTree["S"]!=null)
	{
		if(!g_aDocTree["C"]._fFrameset)
		{
			selectFrameset.options.remove(2);
			selectFrameset.options.remove(1);
		}
		if(g_nFramesetLayout == 3)
		{
			idSelection.selected = true;
		}
		separatorFrameset.style.display = "inline";
		cellFrameset.style.display = "inline";
	}
}
function getPageWidth()
{
	return g_aDocTree["C"].Page(1).offsetWidth;
}
function getPageHeight()
{
	return g_aDocTree["C"].Page(1).offsetHeight;
}
function UndisplayPages()
{
	while (g_cPagesDisplayed > 0)
	{
		var oPage = DisplayPage(g_nDispPage + g_cPagesDisplayed - 1);
		if (oPage != null)
		{
			oPage.style.top = "-20000px";
			oPage.style.left = "10px";
		}
		g_cPagesDisplayed--;
	}
	var oAnchorRule = GetRuleFromSelector(".MarginAnchor");
	oAnchorRule.style.display = "none";
}
function PositionPages(nDispPage)
{
	var fRendering = false;
	if((g_fCheckAutoFit || g_fCheckOrphan) && g_nDocsToCalc>0) {
		UndisplayPages();
		fRendering = true;
	}
	var strDispDoc = DisplayDocument(nDispPage);
	if (g_aDocTree != null && g_aDocTree[strDispDoc] != null && g_aDocTree[strDispDoc].Pages() > 0)
	{
		UndisplayPages();
		RecalculateZoom();
		MasterContainer.style.zoom = g_nZoomLevel + "%";
		var xPageWidth = getPageWidth();
		var yPageHeight = getPageHeight();
		var nMaxPage = TotalDisplayPages();
		var xContainerWidth = (OverflowContainer.offsetWidth)*100/g_nZoomLevel;
		var yContainerHeight = OverflowContainer.offsetHeight*100/g_nZoomLevel;
		if(g_zoomLayout==0)
		{
			g_cxDisplaySlots = g_zoomLayoutX;
			g_cyDisplaySlots = g_zoomLayoutY;
		}
		else
		{
			g_cxDisplaySlots = 1;
			g_cyDisplaySlots = 1;
		}
		var yOff = (yContainerHeight - (g_cyDisplaySlots * yPageHeight) - ((g_cyDisplaySlots-1)*10)) / 2;
		if(yOff<0)
		{
			xContainerWidth -= 20*100/g_nZoomLevel;
			yOff = 10;
		}
		var xOff = (xContainerWidth - (g_cxDisplaySlots * xPageWidth) - ((g_cxDisplaySlots-1)*10)) / 2;
		if(xOff<0) xOff = 0;
		if(fRendering)
		{
			EmptyPage.style.left = xOff;
			EmptyPage.style.top = yOff;
			EmptyPage.style.display = "block";
			return;
		}
		else
		{
			EmptyPage.style.display = "none";
		}
		var nMaxPageRequest = Max(nMaxPage - g_cxDisplaySlots * g_cyDisplaySlots + 1, 1);
		if (nDispPage < 1)
		{
			nDispPage = 1;
		}
		else if (nDispPage > nMaxPageRequest)
		{
			nDispPage = nMaxPageRequest;
		}
		g_nDispPage = nDispPage;
		document.all.spanPageTotal.innerText = nMaxPage;
		document.all.inputPageNum.value = g_nDispPage;
		updateNavButtons();
		var xDisplaySlot = 1;
		var yDisplaySlot = 1;
		var iPage = g_nDispPage;
		g_cPagesDisplayed = 0;
		while (iPage <= nMaxPage && yDisplaySlot <= g_cyDisplaySlots)
		{
			var xPos = xOff + (xDisplaySlot-1)*(xPageWidth+10);
			var yPos = yOff + (yDisplaySlot-1)*(yPageHeight+10);
			var oPage = DisplayPage(iPage);
			oPage.style.left = xPos;
			oPage.style.top = yPos;
			iPage++;
			if (++xDisplaySlot > g_cxDisplaySlots)
			{
				xDisplaySlot = 1;
				yDisplaySlot++;
			}
			g_cPagesDisplayed++;
		}
		var oAnchorRule = GetRuleFromSelector(".MarginAnchor");
		if(g_zoomLayout==-2)
		{
			var oPage = DisplayPage(g_nDispPage);
			maLeft.style.pixelLeft = (oPage.style.pixelLeft * g_nZoomLevel/100) - 10;
			maTop.style.left = (oPage.style.pixelLeft * g_nZoomLevel/100) - 20;
			maRight.style.left = ((oPage.style.pixelLeft + xPageWidth) * g_nZoomLevel/100) - 10;
			maLeft.style.pixelTop = (oPage.style.pixelTop * g_nZoomLevel/100) - 20;
			maTop.style.top = oPage.style.pixelTop * g_nZoomLevel/100 - 10;
			maRight.style.top = maLeft.style.pixelTop;
			maBottom.style.left = maTop.style.pixelLeft;
			maBottom.style.top = ((oPage.style.pixelTop + yPageHeight) * g_nZoomLevel/100) - 10;
			maLeft.style.pixelLeft += g_nMarginLeft * g_nScreenDPI * g_nZoomLevel/100;
			maTop.style.pixelTop += g_nMarginTop * g_nScreenDPI * g_nZoomLevel/100;
			maRight.style.pixelLeft -= g_nMarginRight * g_nScreenDPI * g_nZoomLevel/100;
			maBottom.style.pixelTop -= g_nMarginBottom * g_nScreenDPI * g_nZoomLevel/100;
			oAnchorRule.style.display = "block";
		}
		else
		{
			oAnchorRule.style.display = "none";
		}
	}
}
function ChangeDispPage(nDispPageNew)
{
	if (isNaN(nDispPageNew))
	{
		inputPageNum.value = g_nDispPage;
	}
	else
	{
		var totalPages = TotalDisplayPages();
		if (nDispPageNew < 1)
		{
			nDispPageNew = 1;
		}
		else if (nDispPageNew > totalPages)
		{
			nDispPageNew = totalPages;
		}
		if((!g_fCheckAutoFit && !g_fCheckOrphan) || g_nDocsToCalc>0)
		{
			PositionPages(nDispPageNew);
		}
	}
	return g_nDispPage;
}
function DisplayDocument(nWhichPage)
{
	switch (g_nFramesetLayout)
	{
	case 0:
		return "C";
		break;
	case 1:
		return g_strActiveFrame;
		break;
	case 3:
		return "S";
		break;
	case 2:
		var i;
		if (!nWhichPage) return null;
		for (i in g_aDocTree)
		{
			if ( nWhichPage >= g_aDocTree[i]._nStartingPage
				&& nWhichPage < (g_aDocTree[i]._nStartingPage + g_aDocTree[i].Pages()))
			{
				return i;
			}
		}
		break;
	default:
		HandleError("Display document cannot be found!", document.URL, "DisplayDocument");
		break;
	}
}
function TotalDisplayPages()
{
	if (g_nFramesetLayout == 2)
	{
		return g_nTotalPages;
	}
	return g_aDocTree[DisplayDocument()].Pages();
}
function DisplayPage(nWhichPage)
{
	if (g_nFramesetLayout != 2)
	{
		return g_aDocTree[DisplayDocument(nWhichPage)].Page(nWhichPage);
	}
	return g_aDocTree[DisplayDocument(nWhichPage)].Page(nWhichPage - g_aDocTree[DisplayDocument(nWhichPage)]._nStartingPage + 1);
}
function DisplayPageLayoutRect(nWhichPage)
{
	var oPage = DisplayPage(nWhichPage);
	if(oPage==null) return null;
	var oRectColl = oPage.getElementsByTagName("LAYOUTRECT");
	if(oRectColl==null || oRectColl.length==0) return null;
	return oRectColl[0];
}
function ChangeZoom()
{
	MasterContainer.style.zoom = g_nZoomLevel + "%";
	PositionPages(g_nDispPage);
	return g_nZoomLevel;
}
function ChangeZoomSpecial(zoomtype)
{
	CalculateZoomSpecial(zoomtype);
	ChangeZoom();
}
function RecalculateZoom()
{
	CalculateZoomSpecial(g_zoomLayout);
}
function CalculateZoomSpecial(zoomtype)
{
	var xPage = getPageWidth();
	var yPage = getPageHeight();
	if(xPage==0 || yPage==0) return;
	var xContainer = OverflowContainer.offsetWidth;
	var yContainer = OverflowContainer.offsetHeight;
	if(zoomtype==0 && g_zoomLayoutX==1 && g_zoomLayoutY==1)
	{
		zoomtype = -2;
	}
	var x,y;
	var factor = 100;
	switch(zoomtype)
	{
	case -1:
		factor = Math.floor(((xContainer - 40)*100)/xPage);
		break;
	case -2:
		x = Math.floor(((xContainer - 40)*100)/xPage);
		y = Math.floor(((yContainer - 40)*100)/yPage);
		factor = Math.min(x,y);
		break;
	case 0:
		x = Math.floor(((xContainer - 20)*100)/((xPage+10)*g_zoomLayoutX));
		y = Math.floor(((yContainer - 20)*100)/((yPage+10)*g_zoomLayoutY));
		factor = Math.min(x,y);
		break;
	default:
		return;
	}
	if(factor<10) factor = 10;
	else if(factor>1000) factor = 1000;
	g_zoomLayout = zoomtype;
	g_nZoomLevel = factor;
}
function BuildTableOfLinks(docSource)
{
	var aLinks = docSource.links;
	var nLinks = aLinks.length;
	if (nLinks > 0)
	{
		var fDuplicate;
		var i;
		var j;
		var newHTM;
		var docLinkTable = document.createElement("BODY");
		var scriptFilter = document.createElement("SPAN");
		var L_LINKSHEADER1_Text = "Shortcut Text";
		var L_LINKSHEADER2_Text = "Internet Address";
		newHTM = "<CENTER><TABLE BORDER=1>";
		newHTM += "<THEAD style=\"display:table-header-group\"><TR><TH>" + L_LINKSHEADER1_Text
				+ "</TH><TH>" + L_LINKSHEADER2_Text + "</TH></TR></THEAD><TBODY>";
		for (i = 0; i < nLinks; i++)
		{
			fDuplicate = false;
			for (j = 0; (!fDuplicate) && (j < i); j++)
			{
				if (aLinks[i].href == aLinks[j].href)
				{
					fDuplicate = true;
				}
			}
			if (!fDuplicate)
			{
				scriptFilter.innerText = aLinks[i].href;
				newHTM += ("<TR><TD>" + aLinks[i].innerText + "</TD><TD>" + scriptFilter.innerHTML + "</TD></TR>");
			}
		}
		newHTM += "</TBODY></TABLE></CENTER>";
		docLinkTable.innerHTML = newHTM;
		return docLinkTable.document;
	}
	return null;
}
function CreateDocument(docURL, strDocID, fUseStreamHeader)
{
	if (g_aDocTree[strDocID])
	{
		return;
	}
	g_aDocTree[strDocID] = new CPrintDoc(strDocID, docURL);
	g_aDocTree[strDocID].InitDocument(fUseStreamHeader);
	g_nDocsToCalc++;
}
function ChangeFramesetLayout(nNewLayout, fForce)
{
	if (g_nFramesetLayout == nNewLayout && !fForce)
	{
		return;
	}
	UndisplayPages();
	g_nFramesetLayout = nNewLayout;
	switch (nNewLayout)
	{
	case 0:
	case 1:
	case 3:
		break;
	case 2:
		g_nTotalPages = 0;
		var i;
		for (i in g_aDocTree)
		{
			if (g_aDocTree[i]._fFrameset || i == "S")
			{
				g_aDocTree[i]._nStartingPage = 0;
			}
			else
			{
				g_aDocTree[i]._nStartingPage = g_nTotalPages + 1;
				g_nTotalPages += g_aDocTree[i].Pages();
			}
		}
		break;
	default:
		HandleError("Impossible frameset layout type: " + nNewLayout, document.URL, "ChangeFramesetLayout");
		break;
	}
	ChangeDispPage(1);
}
function EnsureDocuments(fForceRepaginate)
{
	var i;
	var tmp;
	var top = Printer.marginTop / 100 || 0;
	var bottom = Printer.marginBottom / 100 || 0;
	var left = Printer.marginLeft / 100 || 0;
	var right = Printer.marginRight / 100 || 0;
	var pageWidth = Printer.pageWidth / 100;
	var pageHeight = Printer.pageHeight / 100;
	var linktable = Printer.tableOfLinks;
	var upTop = Printer.unprintableTop / 100 || 0;
	var upBottom = Printer.unprintableBottom / 100 || 0;
	var header = Printer.header;
	var footer = Printer.footer;
	var bSTF = dialogArguments.__IE_ShrinkToFit;
	var strHeaderFooterFont = Printer.headerFooterfont;
	if (header && upTop)
	{
		tmp = upTop + (27 / 100);
		if (!top || tmp > top)
		{
			top = tmp;
		}
	}
	if (footer && upBottom)
	{
		tmp = upBottom + (27 / 100);
		if (!bottom || tmp > bottom)
		{
			bottom = tmp;
		}
	}
	g_nUnprintTop = upTop || g_nUnprintTop;
	var oRule = GetRuleFromSelector(".divHead");
	if (oRule == null)
	{
		HandleError("'.divHead' rule does not exist!", document.URL, "CPrintDoc::EnsureDocuments");
	}
	oRule.style.top = upTop + "in";
	g_nUnprintBottom= upBottom || g_nUnprintBottom;
	var oRule = GetRuleFromSelector(".divFoot");
	if (oRule == null)
	{
		HandleError("'.divFoot' rule does not exist!", document.URL, "CPrintDoc::EnsureDocuments");
	}
	oRule.style.bottom = upBottom + "in";
	var oMarginsAtPage = GetAuthorSpecifiedMargins("");
	var oMarginsAtPageFirst = GetAuthorSpecifiedMargins("first");
	var oMarginsAtPageLeft = GetAuthorSpecifiedMargins("left");
	var oMarginsAtPageRight = GetAuthorSpecifiedMargins("right");
	if (top != g_nMarginTop || bottom != g_nMarginBottom || left != g_nMarginLeft || right != g_nMarginRight
		|| pageWidth != g_nPageWidth || pageHeight != g_nPageHeight || header != g_strHeader || footer != g_strFooter
		|| strHeaderFooterFont != g_strHeaderFooterFont || !CompareMarginObjects(oMarginsAtPage, g_oMarginsAtPage)
		|| !CompareMarginObjects(oMarginsAtPageFirst, g_oMarginsAtPageFirst) || !CompareMarginObjects(oMarginsAtPageLeft, g_oMarginsAtPageLeft)
		|| !CompareMarginObjects(oMarginsAtPageRight, g_oMarginsAtPageRight) || bSTF != g_bSTF || fForceRepaginate == true)
	{
		g_nMarginTop = top;
		g_nMarginBottom = bottom;
		g_nMarginLeft = left;
		g_nMarginRight = right;
		g_nPageWidth = pageWidth;
		g_nPageHeight = pageHeight;
		g_fTableofLinks = linktable;
		g_strHeader = header;
		g_strFooter = footer;
		g_bSTF = bSTF;
		g_strHeaderFooterFont = strHeaderFooterFont
		g_oMarginsAtPage = oMarginsAtPage;
		g_oMarginsAtPageFirst = oMarginsAtPageFirst;
		g_oMarginsAtPageLeft = oMarginsAtPageLeft;
		g_oMarginsAtPageRight = oMarginsAtPageRight;
		HeadFoot.textHead = g_strHeader;
		HeadFoot.textFoot = g_strFooter;
		HeadFoot.font = g_strHeaderFooterFont;
		UndisplayPages();
		g_nTotalPages = 0;
		g_nDocsToCalc = 0;
		for (i in g_aDocTree)
		{
			g_nDocsToCalc++;
			g_aDocTree[i].ResetDocument();
		}
		g_ObsoleteBar++;
		var oRule;
		if (pageWidth && pageHeight)
		{
			oRule = GetRuleFromSelector(".page");
			if (oRule == null)
			{
				HandleError("'.page' rule does not exist!", document.URL, "CPrintDoc::EnsureDocuments");
			}
			oRule.style.width = pageWidth + "in";
			oRule.style.height = pageHeight + "in";
		}
		oRule = GetRuleFromSelector(".mRect");
		if (oRule == null)
		{
			HandleError("'.mRect' rule does not exist!", document.URL, "CPrintDoc::EnsureDocuments");
		}
		oRule.style.marginLeft = left + "in";
		oRule.style.marginRight = right + "in";
		oRule.style.marginTop = top + "in";
		oRule.style.marginBottom = bottom + "in";
		oRule.style.zoom = g_nScalePercent + "%";
		ApplyAuthorSpecifiedMargins("AtPage", oMarginsAtPage);
		ApplyAuthorSpecifiedMargins("AtPageFirst", oMarginsAtPageFirst);
		ApplyAuthorSpecifiedMargins("AtPageLeft", oMarginsAtPageLeft);
		ApplyAuthorSpecifiedMargins("AtPageRight", oMarginsAtPageRight);
		var arMargins = new Array();
		arMargins.push(g_oUserOverrideForMargins);
		arMargins.push(oMarginsAtPageFirst);
		arMargins.push(oMarginsAtPageRight);
		arMargins.push(oMarginsAtPage);
		var computedLeftMargin = null;
		var computedRightMargin = null;
		var computedTopMargin = null;
		var computedBottomMargin = null;
		for (var iIndex = 0; iIndex < arMargins.length; iIndex++)
		{
			if (arMargins[iIndex] != null)
			{
				if (arMargins[iIndex].left != null && computedLeftMargin == null)
				{
					computedLeftMargin = arMargins[iIndex].left;
				}
				if (arMargins[iIndex].right != null && computedRightMargin == null)
				{
					computedRightMargin = arMargins[iIndex].right;
				}
				if (arMargins[iIndex].top != null && computedTopMargin == null)
				{
					computedTopMargin = arMargins[iIndex].top;
				}
				if (arMargins[iIndex].bottom != null && computedBottomMargin == null)
				{
					computedBottomMargin = arMargins[iIndex].bottom;
				}
			}
		}
		if (computedLeftMargin == null)
		{
			computedLeftMargin = left;
		}
		if (computedRightMargin == null)
		{
			computedRightMargin = right;
		}
		if (computedTopMargin == null)
		{
			computedTopMargin = top;
		}
		if (computedBottomMargin == null)
		{
			computedBottomMargin = bottom;
		}
		var oMRectUserOverrideRule = GetRuleFromSelector(".mRectUserOverride");
		if (oMRectUserOverrideRule == null)
		{
			HandleError("'.mRectUserOverride' rule does not exist!", document.URL, "CPrintDoc::EnsureDocuments");
		}
		var conWidth = (pageWidth ? pageWidth - computedLeftMargin - computedRightMargin : 0);
		var conHeight = (pageHeight ? pageHeight - computedTopMargin - computedBottomMargin : 0);
		if (conWidth < 0)
		{
			conWidth = 0;
		}
		if (conHeight < 0)
		{
			conHeight = 0;
		}
		g_nMarginTop = computedTopMargin;
		g_nMarginBottom = computedBottomMargin;
		g_nMarginLeft = computedLeftMargin;
		g_nMarginRight = computedRightMargin;
		oMRectUserOverrideRule.style.width = (conWidth*100/g_nScalePercent) + "in";
		oMRectUserOverrideRule.style.height = (conHeight*100/g_nScalePercent) + "in";
		if (g_oUserOverrideForMargins.left != null)
		{
			oMRectUserOverrideRule.style.marginLeft = g_oUserOverrideForMargins.left + "in";
		}
		if (g_oUserOverrideForMargins.right != null)
		{
			oMRectUserOverrideRule.style.marginRight = g_oUserOverrideForMargins.right + "in";
		}
		if (g_oUserOverrideForMargins.top != null)
		{
			oMRectUserOverrideRule.style.marginTop = g_oUserOverrideForMargins.top + "in";
		}
		if (g_oUserOverrideForMargins.bottom != null)
		{
			oMRectUserOverrideRule.style.marginBottm = g_oUserOverrideForMargins.bottom + "in";
		}
		oRule = GetRuleFromSelector(".divHead");
		if (oRule == null)
		{
			HandleError("'.divHead' rule does not exist!", document.URL, "CPrintDoc::EnsureDocuments");
		}
		oRule.style.left = left + "in";
		oRule.style.width = conWidth + "in";
		oRule = GetRuleFromSelector(".divFoot");
		if (oRule == null)
		{
			HandleError("'.divHead' rule does not exist!", document.URL, "CPrintDoc::EnsureDocuments");
		}
		oRule.style.left = left + "in";
		oRule.style.width = conWidth + "in";
		if (g_oUserOverrideForMargins.left != null)
		{
			var oRuleHeadUserOverride = GetRuleFromSelector(".divHeadUserOverride");
			if (oRuleHeadUserOverride!= null)
			oRuleHeadUserOverride.style.left = g_oUserOverrideForMargins.left + "in";
			var oRuleFootUserOverride = GetRuleFromSelector(".divFootUserOverride");
			if (oRuleFootUserOverride!= null)
			oRuleFootUserOverride.style.left = g_oUserOverrideForMargins.left + "in";
		}
		for (i in g_aDocTree)
		{
			g_aDocTree[i].InitDocument((g_aDocTree[i]._anMerge[1] == 1));
		}
		if (g_nFramesetLayout == 2)
		{
			ChangeFramesetLayout(g_nFramesetLayout, true);
		}
		PositionPages(g_nDispPage);
	}
	else if (linktable != g_fTableOfLinks)
	{
		g_fTableOfLinks = linktable;
		for (i in g_aDocTree)
		{
			g_aDocTree[i].ResetTableOfLinks();
		}
	}
}
function CalcAutoFit()
{
	var docWidthPx = 0;
	var docWidthIn = 0;
	var printerWidth = Printer.pageWidth / 100;
	var scale = 100;
	var docClientWidthPx = 0;
	if (g_nScreenDPI == 0)
	{
		return scale;
	}
	printerWidth -= g_nMarginLeft;
	printerWidth -= g_nMarginRight;
	var nCount = TotalDisplayPages();
	var i;
	for(i = 1; i<=nCount; i++)
	{
		var oRect = DisplayPageLayoutRect(i);
		if(oRect!=null)
		{
			if (oRect.scrollWidth > docWidthPx)
			{
				docWidthPx = oRect.scrollWidth;
			}
			if (oRect.clientWidth > docClientWidthPx)
			{
				docClientWidthPx = oRect.clientWidth;
			}
		}
	}
	docWidthIn = docWidthPx * (1/g_nScreenDPI);
	if (docWidthPx == 0 || docClientWidthPx >= docWidthPx)
	{
		return scale;
	}
	scale = (printerWidth / docWidthIn) * 100;
	scale = Math.floor(scale+0.05);
	if (scale < 30)
	{
		scale = 30;
	}
	if (scale > 100)
	{
		scale = 100;
	}
	return scale;
}
function IsOrphaned()
{
	if((g_nFramesetLayout!=0 && g_nFramesetLayout!=1) || TotalDisplayPages()!=2)
	{
		return false;
	}
	var printerHeight = Printer.pageHeight / 100;
	printerHeight -= g_nMarginTop;
	printerHeight -= g_nMarginBottom;
	if(printerHeight <= 0) return false;
	var oSecondRect = DisplayPageLayoutRect(2);
	if(g_nScreenDPI==0) return false;
	var layoutHeight = oSecondRect.scrollHeight/g_nScreenDPI;
	var pageCoverage = layoutHeight * 100 / printerHeight;
	return pageCoverage < 10;
}
function CalcOrphanRemovalScale()
{
	var scale = 100;
	var printerHeight = Printer.pageHeight / 100;
	printerHeight -= g_nMarginTop;
	printerHeight -= g_nMarginBottom;
	if(printerHeight <= 0) return scale;
	var oSecondRect = DisplayPageLayoutRect(2);
	if(oSecondRect==null) return scale;
	if(g_nScreenDPI==0) return false;
	var totalHeight = oSecondRect.scrollHeight;
	totalHeight = totalHeight / g_nScreenDPI;
	totalHeight += printerHeight;
	if(totalHeight <= 0) return scale;
	scale = printerHeight*100/totalHeight;
	scale = Math.floor(scale+0.05);
	if(scale>100) scale = 100;
	return scale;
}
function Close()
{
	Printer.updatePageStatus(-1);
	DumpOptions();
	if (g_fDelayClose)
	{
		g_fDelayClose = false;
		window.setTimeout("Close()", 120000);
		return;
	}
	WindowClose();
}
function PrintAll()
{
	var i;
	var nFirstDoc;
	if (g_nFramesLeft > 0 && Printer.framesetDocument && !Printer.frameAsShown)
	{
		window.setTimeout("PrintAll()", 100);
		return;
	}
	EnsureDocuments(false);
	if (Printer.copies <= 0)
	{
		Close();
	}
	else if (Printer.selectedPages && Printer.pageFrom > Printer.pageTo )
	{
		// "The 'From' value cannot be greater than the 'To' value.";
		var L_PAGERANGE_ErrorMessage = "打印页面范围应该按先小后大顺序指定。";
		alert(L_PAGERANGE_ErrorMessage);
		if (!g_fPreview) PrintNow(true);
	}
	else
	{
		g_cLeftToPrint = 1;
		Printer.updatePageStatus(1);
		var strSel;
		if (Printer.selection)
		{
			strSel = "S";
		}
		else if (Printer.frameActive && !!g_strActiveFrame)
		{
			strSel = g_strActiveFrame;
		}
		else
		{
			strSel = "C";
		}
		PrintSentinel(strSel, true);
	}
}
function PrintSentinel(strDoc, fRecursionOK)
{
	if (g_fCheckAutoFit || g_fCheckOrphan || !g_aDocTree[strDoc] || !g_aDocTree[strDoc].ReadyToPrint())
	{
		window.setTimeout("PrintSentinel('" + strDoc + "'," + fRecursionOK + ");", 500);
		return;
	}
	g_aDocTree[strDoc].Print(fRecursionOK);
}
function PrintDocumentComplete()
{
	g_cLeftToPrint--;
	if (g_cLeftToPrint <= 0)
	{
		Close();
	}
}
function PrintNow(fWithPrompt)
{
	if (!g_aDocTree["C"] || !g_aDocTree["C"]._aaRect[1][0] || !g_aDocTree["C"]._aaRect[1][0].contentDocument.body)
	{
		window.setTimeout("PrintNow('" + fWithPrompt + "');", 100);
		return;
	}
	var oDoc = g_aDocTree["C"]._aaRect[1][0].contentDocument;
	var fConfirmed;
	var fFramesetDocument = (oDoc.body.tagName.toUpperCase() == "FRAMESET");
	var fActiveFrame = (oDoc.getElementsByTagName("HTML").item(0).__IE_ActiveFrame != null);
	Printer.framesetDocument = fFramesetDocument;
	Printer.frameActiveEnabled = fActiveFrame;
	if (g_fPreview)
	{
		Printer.frameActive = (g_nFramesetLayout == 1 || g_nFramesetLayout == 3);
		Printer.frameAsShown = (g_nFramesetLayout == 0);
		Printer.currentPageAvail = true;
	}
	else
	{
		Printer.frameActive = fActiveFrame;
		Printer.frameAsShown = false;
		Printer.currentPageAvail = false;
	}
	Printer.selectionEnabled = !!(dialogArguments.__IE_ContentSelectionUrl);
	Printer.selection = Printer.selectionEnabled && (g_nFramesetLayout == 3);
	fConfirmed = (eval(fWithPrompt)) ? Printer.showPrintDialog() : Printer.ensurePrintDialogDefaults();
	if (fConfirmed)
	{
		if (Printer.selection && dialogArguments.__IE_ContentSelectionUrl && g_aDocTree["S"]==null)
		{
			CreateDocument(dialogArguments.__IE_ContentSelectionUrl, "S", true);
		}
		Printer.usePrinterCopyCollate = (Printer.deviceSupports("copies") >= Printer.copies && (!Printer.collate || Printer.deviceSupports("collate")) );
		PrintAll();
	}
	else if (!g_fPreview)
	{
		Close();
	}
	else
	{
		Printer.tableoflinks = false;
	}
}
function CPrintDoc_ReadyToPrint()
{
	if(g_fCheckAutoFit || g_fCheckOrphan) return false;
	return (this._nStatus == 4 && this._aaRect[1][0].contentDocument.readyState == "complete");
}
function CPrintDoc_Print(fRecursionOK)
{
	if (!this.ReadyToPrint())
	{
		HandleError("Printing when not ready!", document.URL, "CPrintDoc::Print");
		return;
	}
	var nCount = (Printer.usePrinterCopyCollate) ? 1 : Printer.copies;
	var nFrom;
	var nTo;
	if (fRecursionOK)
	{
		var fFrameset = (this._aaRect[1][0].contentDocument.body.tagName.toUpperCase() == "FRAMESET");
		if (Printer.frameActive)
		{
			var n = parseInt(this._aaRect[1][0].contentDocument.getElementsByTagName("HTML").item(0).__IE_ActiveFrame);
			if (n >= 0)
			{
				var oTargetFrame = (fFrameset)
					? this._aaRect[1][0].contentDocument.getElementsByTagName("FRAME").item(n)
					: this._aaRect[1][0].contentDocument.getElementsByTagName("IFRAME").item(n);
				if (IsPersistedDoc() && (oTargetFrame.src == "res://IEFRAME.DLL/printnof.htm" || oTargetFrame.src == "about:blank"))
				{
					Printer.printNonNativeFrames(this._aaRect[1][0].contentDocument, true);
				}
				else
				{
					this.CreateSubDocument(oTargetFrame.src, true);
					this.PrintAllSubDocuments(true);
				}
				PrintDocumentComplete();
				return;
			}
		}
		if (fFrameset)
		{
			if (!Printer.frameAsShown)
			{
				this.PrintAllSubDocuments(true);
				if (IsPersistedDoc())
				{
					Printer.printNonNativeFrames(this._aaRect[1][0].contentDocument, false);
				}
				PrintDocumentComplete();
				return;
			}
			else
			{
				Printer.printNonNativeFrames(this._aaRect[1][0].contentDocument, false);
			}
		}
		else
		{
			if (Printer.allLinkedDocuments)
			{
				this.BuildAllLinkedDocuments();
				this.PrintAllSubDocuments(false);
			}
		}
	}
	if (Printer.printNonNative(this._aaRect[1][0].contentDocument) )
	{
		g_fDelayClose = !g_fPreview;
		PrintDocumentComplete();
		return;
	}
	if (Printer.selectedPages)
	{
		nFrom = Printer.pageFrom;
		nTo = Printer.pageTo;
		if (nFrom < 1)
		{
			nFrom = 1;
		}
		if (nTo > this.Pages())
		{
			nTo = this.Pages();
		}
	}
	else if ( Printer.currentPage && this._strDoc == DisplayDocument())
	{
		nFrom = (this.Pages() >= g_nDispPage) ? g_nDispPage : this.Pages();
		nTo = nFrom;
	}
	else
	{
		nFrom = 1;
		nTo = this.Pages();
	}
	if (nTo < nFrom)
	{
		PrintDocumentComplete();
		return;
	}
	if (Printer.startDoc(g_oPrintX.DocumentName || this._aaRect[1][0].contentDocument.URL))
	{
		if (Printer.collate)
		{
			var fExtraPage = (Printer.duplex && ((nFrom - nTo) % 2 == 0));
			var j;
			for (j = 0; j < nCount; j++)
			{
				for (i = nFrom; i <= nTo; i++)
				{
					Printer.printPage(this.Page(i).children[0]);
				}
				if (fExtraPage)
				{
					Printer.printBlankPage();
				}
			}
		}
		else
		{
			var fDuplex = Printer.duplex;
			for (i = nFrom; i <= nTo; i++)
			{
				for (j = 0; j < nCount; j++)
				{
					Printer.printPage(this.Page(i).children[0]);
					if (fDuplex)
					{
						if (i < nTo)
						{
							Printer.printPage(this.Page(i+1));
						}
						else
						{
							Printer.printBlankPage();
						}
					}
				}
				if (fDuplex)
				{
					i++;
				}
			}
		}
		Printer.stopDoc();
	}
	PrintDocumentComplete();
}
function CPrintDoc_RectComplete(fOverflow, strElement)
{
	var nStatus = parseInt(strElement.substr(5,1));
	var nPage = parseInt(strElement.substr(strElement.lastIndexOf("p") + 1));
	if (nStatus > this._nStatus)
	{
		return false;
	}
	if (nPage != this._acPage[nStatus] - 1 + this._anMerge[nStatus])
	{
		return false;
	}
	if (nStatus != this._nStatus)
	{
		if (!fOverflow)
		{
			return false;
		}
		this.StopFixupHF();
		if (this._nStatus == 4)
		{
			g_nDocsToCalc++;
		}
		this._nStatus = nStatus;
	}
	if (fOverflow)
	{
		this.AddPage();
	}
	else
	{
		switch (this._nStatus)
		{
		case 0:
			this._nStatus = 1;
			this.AddFirstPage();
			this._aaRect[this._nStatus][0].contentSrc = this._strDocURL;
			break;
		case 1:
			this._nStatus = 2;
			this.AddTableOfLinks();
			break;
		case 2:
			this._nStatus = 3;
			if (this._strDoc == DisplayDocument()) {
				ChangeDispPage(g_nDispPage);
			}
			this.FixupHF();
			break;
		}
	}
	if (this._strDoc == DisplayDocument())
	{
		spanPageTotal.innerText = this.Pages();
		updateNavButtons();
	}
}
function CPrintDoc_AddPage()
{
	var newHTM = "";
	var aPage = this._aaPage[this._nStatus];
	var aRect = this._aaRect[this._nStatus];
	(this._acPage[this._nStatus])++;
	HeadFoot.URL = this.EnsureURL();
	HeadFoot.title = this.EnsureTitle();
	HeadFoot.pageTotal = this.Pages();
	HeadFoot.page = HeadFoot.pageTotal;
	if (this._acPage[this._nStatus] <= aPage.length)
	{
		var oPage = aPage[this._acPage[this._nStatus] - 1];
		oPage.children("header").innerHTML = HeadFoot.HtmlHead;
		oPage.children("footer").innerHTML = HeadFoot.HtmlFoot;
	}
	else
	{
		var classLayoutRect = "mRect";
		var classHeader = "divHead";
		var classFooter = "divFoot";
		var nNewPageNumber = aPage.length + 1;
		classLayoutRect += " mRectAtPage";
		classHeader += " divHeadAtPage";
		classFooter += " divFootAtPage";
		if ((nNewPageNumber % 2) == 1)
		{
			classLayoutRect += " mRectAtPageRight";
			classHeader += " divHeadAtPageRight";
			classFooter += " divFootAtPageRight";
		}
		else
		{
			classLayoutRect += " mRectAtPageLeft";
			classHeader += " divHeadAtPageLeft";
			classFooter += " divFootAtPageLeft";
		}
		if (nNewPageNumber == 1)
		{
			classLayoutRect += " mRectAtPageFirst";
			classHeader += " divHeadAtPageFirst";
			classFooter += " divFootAtPageFirst";
		}
		classLayoutRect += " mRectUserOverride";
		classHeader += " divHeadUserOverride";
		classFooter += " divFootUserOverride";
		newHTM = "<DIV class=divPage><IE:DeviceRect media=\"print\" class=page id=mDiv" + this._nStatus + this._strDoc + "p" + aPage.length + ">";
		newHTM += "<IE:LAYOUTRECT id=mRect" + this._nStatus + this._strDoc + "p" + aRect.length;
		newHTM += " class='" + classLayoutRect + "' nextRect=mRect" + this._nStatus + this._strDoc + "p" + (aRect.length + 1);
		newHTM += " onlayoutcomplete=\"OnRectComplete('" + this._strDoc + "', " + g_ObsoleteBar + ")\"";
		newHTM += " tabindex=-1 onbeforefocusenter='event.returnValue=false;' ";
		newHTM += " />";
		newHTM += "<DIV class='" + classHeader + "' id=header>";
		newHTM += HeadFoot.HtmlHead;
		newHTM += "</DIV>";
		newHTM += "<DIV class='" + classFooter + "' id=footer>";
		newHTM += HeadFoot.HtmlFoot;
		newHTM += "</DIV>";
		newHTM += "</IE:DeviceRect></DIV>";
		MasterContainer.insertAdjacentHTML("beforeEnd", newHTM);
		aPage[aPage.length] = eval("document.all.mDiv" + this._nStatus + this._strDoc + "p" + aPage.length);
		aRect[aRect.length] = eval("document.all.mRect" + this._nStatus + this._strDoc + "p" + aRect.length);
	}
}
function CPrintDoc_AddFirstPage()
{
	this._acPage[this._nStatus] = 0;
	if (this._anMerge[this._nStatus] == 0)
	{
		this.AddPage();
	}
	else
	{
		var aRect = this._aaRect[this._nStatus];
		var oPage = this._aaPage[this._nStatus - 1][this._acPage[this._nStatus - 1] - 1];
		var oTop = this._aaRect[this._nStatus - 1][this._acPage[this._nStatus - 1] + this._anMerge[this._nStatus - 1] - 1];
		var nTop = oTop.offsetTop + oTop.scrollHeight*g_nScalePercent/100;
		var nHeight = oTop.clientHeight - oTop.scrollHeight;
		if (aRect.length > 0)
		{
			var oNode = aRect[0];
			oNode.style.marginTop = nTop + "px";
			oNode.style.pixelHeight = nHeight;
			if (oNode.parentElement != oPage)
			{
				oPage.insertBefore(oNode);
			}
		}
		else
		{
			var newHTM;
			var oNode;
			newHTM = "<IE:LAYOUTRECT id=mRect" + this._nStatus + this._strDoc + "p0";
			newHTM += " class=mRect nextRect=mRect" + this._nStatus + this._strDoc + "p1";
			newHTM += " onlayoutcomplete=\"OnRectComplete('" + this._strDoc + "', " + g_ObsoleteBar + ")\"";
			newHTM += " tabindex=-1 onbeforefocus='event.returnValue=false;'";
			newHTM += " />";
			oPage.insertAdjacentHTML("beforeEnd", newHTM);
			oNode = eval("document.all.mRect" + this._nStatus + this._strDoc + "p0");
			aRect[0] = oNode;
			oNode.style.marginTop = nTop + "px";
			oNode.style.height = nHeight + "px";
		}
	}
}
function CPrintDoc_InitDocument(fUseStreamHeader)
{
	var fReallyUseStreamHeader = (fUseStreamHeader && (dialogArguments.__IE_OutlookHeader != null));
	this._anMerge[1] = (fReallyUseStreamHeader) ? 1 : 0;
	this._nStatus = ((fReallyUseStreamHeader) ? 0 : 1);
	this.AddFirstPage();
	this._aaRect[this._nStatus][0].contentSrc = (fReallyUseStreamHeader) ? dialogArguments.__IE_OutlookHeader : this._strDocURL;
}
function CPrintDoc_PrintAllSubDocuments(fRecursionOK)
{
	if (this._aDoc)
	{
		var nDocs = this._aDoc.length;
		var i;
		g_cLeftToPrint += nDocs;
		for (i = 0; i < nDocs; i++)
		{
			PrintSentinel(this._aDoc[i]._strDoc, fRecursionOK);
		}
	}
}
function CPrintDoc_BuildAllLinkedDocuments()
{
	var strURL = this._aaRect[1][0].contentDocument.URL;
	var aLinks = this._aaRect[1][0].contentDocument.links;
	var nLinks = aLinks.length;
	var i;
	var j;
	var strLink;
	for (i = 0; i < nLinks; i++)
	{
		strLink = aLinks[i].href;
		if (strURL == strLink || UnprintableURL(strLink))
		{
			continue;
		}
		for (j = 0; j < i; j++)
		{
			if (strLink == aLinks[j].href)
			{
				break;
			}
		}
		if (j < i)
		{
			continue;
		}
		this.CreateSubDocument(strLink, false);
	}
}
function OnBuildAllFrames(strDoc)
{
	if (!g_aDocTree[strDoc] || !g_aDocTree[strDoc]._aaRect[1][0] || !g_aDocTree[strDoc]._aaRect[1][0].contentDocument.body)
	{
		window.setTimeout("OnBuildAllFrames('" + strDoc + "');", 100);
		return;
	}
	g_aDocTree[strDoc].BuildAllFrames();
}
function IsPersistedDoc()
{
	return (!!g_aDocTree["C"]._aaRect[1][0].contentDocument.getElementsByTagName("HTML").item(0).__IE_DisplayURL);
}
function CPrintDoc_BuildAllFrames()
{
	var aFrames = this._aaRect[1][0].contentDocument.getElementsByTagName("FRAME");
	var nFrames = aFrames.length;
	if (nFrames > 0)
	{
		var nActive = parseInt(this._aaRect[1][0].contentDocument.getElementsByTagName("HTML").item(0).__IE_ActiveFrame);
		var i, strSrc, strDoc;
		this._fFrameset = true;
		for (i = 0; i < nFrames; i++)
		{
			strSrc = (!aFrames[i].src) ? " " : aFrames[i].src;
			if (strSrc == "res://IEFRAME.DLL/printnof.htm")
			{
				continue;
			}
			strDoc = this.CreateSubDocument(strSrc, true);
			if (i == nActive)
			{
				g_strActiveFrame = strDoc;
			}
			g_nFramesLeft++;
			OnBuildAllFrames(strDoc);
		}
	}
	g_nFramesLeft--;
	if (g_nFramesLeft <= 0)
	{
		BuildAllFramesComplete();
	}
}
function CPrintDoc_CreateSubDocument( docURL, fUseStreamHeader )
{
	if (!this._aDoc) this._aDoc = new Array();
	var nDoc = this._aDoc.length;
	var strDoc = this._strDoc + "_" + nDoc;
	CreateDocument(docURL, strDoc, fUseStreamHeader);
	this._aDoc[nDoc] = g_aDocTree[strDoc];
	return (strDoc);
}
function CPrintDoc_AddTableOfLinks()
{
	if (!g_fTableOfLinks)
	{
		this._nStatus = 3;
		ChangeDispPage(g_nDispPage);
		this.FixupHF();
	}
	else
	{
		var oTableOfLinks = BuildTableOfLinks(this._aaRect[1][0].contentDocument);
		if (oTableOfLinks != null)
		{
			var oBody = oTableOfLinks.body;
			this.AddFirstPage()
			this._aaRect[this._nStatus][0].contentSrc = oBody.document;
		}
		else
		{
			this._nStatus = 3;
			ChangeDispPage(g_nDispPage);
			this.FixupHF();
		}
	}
}
function OnTickHF( strDoc )
{
	if (!g_aDocTree[strDoc])
	{
		HandleError("Document " + strDoc + " does not exist.", document.URL, "OnRectComplete");
		return;
	}
	g_aDocTree[strDoc].TickHF();
}
function CPrintDoc_TickHF()
{
	var i, j;
	var iTo, jTo;
	var aTok;
	var oTok;
	var nStartPage = this._nNextHF;
	var cPages = this.Pages();
	iTo = nStartPage + 2;
	if (iTo > cPages)
	{
		iTo = cPages;
	}
	for (i = nStartPage; i <= iTo; i++)
	{
		aTok = this.Page(i).children[0].getElementsByTagName("SPAN");
		for (j=0, jTo = aTok.length; j < jTo; j++)
		{
			oTok = aTok[j];
			if (oTok.className == "hfPageTotal")
			{
				oTok.innerText = cPages;
			}
			else if (oTok.className == "hfUrl" && oTok.innerText == "")
			{
				oTok.innerText = this.EnsureURL();
			}
			else if (oTok.className == "hfTitle" && oTok.innerText == "")
			{
				oTok.innerText = this.EnsureTitle();
			}
		}
	}
	this._nNextHF = i;
	if (iTo == cPages)
	{
		this._nStatus = 4;
		if (--g_nDocsToCalc == 0)
		{
			window.setTimeout("CalcDocsComplete()", 1);
		}
	}
	else
	{
		this._nTimerHF = window.setTimeout("OnTickHF('" + this._strDoc + "');", 250);
	}
}
function CPrintDoc_FixupHF()
{
	this.TickHF();
}
function CPrintDoc_Pages()
{
	var i;
	var c;
	for (i = 0, c = 0; i < 3; i++)
	{
		c += this._acPage[i];
	}
	return c;
}
function CPrintDoc_Page(nPage)
{
	var i;
	var n = nPage;
	if (n <= 0)
	return null;
	for (i = 0; i < 3; i++)
	{
		if (n <= this._acPage[i])
		{
			return this._aaPage[i][n - 1].parentElement;
		}
		n -= this._acPage[i];
	}
	return null;
}
function CPrintDoc_EnsureURL()
{
	if (this._strURL == null)
	{
		if (this._aaRect[1][0] && this._aaRect[1][0].contentDocument)
		{
			this._strURL = this._aaRect[1][0].contentDocument.URL;
		}
		if (this._strURL == null)
		{
			return "";
		}
	}
	return this._strURL;
}
function CPrintDoc_EnsureTitle()
{
	if (this._strTitle == null)
	{
		if (this._aaRect[1][0] && this._aaRect[1][0].contentDocument)
		{
			this._strTitle = this._aaRect[1][0].contentDocument.title;
		}
		if (this._strTitle == null)
		{
			return "";
		}
	}
	return this._strTitle;
}
function CPrintDoc_ResetDocument()
{
	var i;
	for (i=0; i<3; i++)
	{
		this._aaRect[i] = new Array();
		this._aaPage[i] = new Array();
		this._acPage[i] = 0;
	}
	MasterContainer.innerHTML = "<div id=\"EmptyPage\" class=\"divPage\" style=\"position:absolute; left:0px; top:0px; display:none;\"><div class=\"page\">&nbsp;</div></div>";
	this.StopFixupHF();
}
function CPrintDoc_ResetTableOfLinks()
{
	if (this._nStatus <= 2) return;
	this.StopFixupHF();
	this._nStatus = 2;
	this.AddTableOfLinks();
}
function CPrintDoc_StopFixupHF()
{
	if (this._nTimerHF != -1) window.clearTimeout(this._nTimerHF);
	this._nTimerHF = -1;
	this._nNextHF = 1;
}
function CPrintDoc(nDocNum, strDocURL)
{
	var i;
	this._aDoc = null;
	this._strDoc = nDocNum;
	this._strDocURL = strDocURL;
	this._nStatus = 0;
	this._aaPage = new Array(3);
	this._aaRect = new Array(3);
	this._acPage = new Array(3);
	this._anMerge = new Array(3);
	for (i=0; i<3; i++)
	{
		this._aaPage[i] = new Array();
		this._aaRect[i] = new Array();
		this._acPage[i] = 0;
		this._anMerge[i]= 0;
	}
	this._nNextHF = 1;
	this._nTimerHF = -1;
	this._strURL = null;
	this._strTitle = null;
	this._fFrameset = false;
	this._nStartingPage = 0;
}
function GetAuthorSpecifiedMargins(strRequestedPseudoClass)
{
	var oAuthorSpecifiedMargins = {left:null, right:null, top:null, bottom:null};
	if (g_nVersion < 8.0)
	{
		return oAuthorSpecifiedMargins;
	}
	var oDocumentToPrint;
	if (g_oPrintedDocument != null)
	{
		oDocumentToPrint = g_oPrintedDocument;
	}
	else if (g_aDocTree["C"] && g_aDocTree["C"]._aaRect[1][0] && g_aDocTree["C"]._aaRect[1][0].contentDocument)
	{
		oDocumentToPrint = g_aDocTree["C"]._aaRect[1][0].contentDocument;
	}
	if (oDocumentToPrint != null)
	{
		var hadTopImportant = false;
		var hadRightImportant = false;
		var hadBottomImportant = false;
		var hadLeftImportant = false;
		var arStyleSheets = oDocumentToPrint.styleSheets;
		for (var iStyleSheet in arStyleSheets)
		{
			var arPages = arStyleSheets[iStyleSheet].pages;
			for (var iPage in arPages)
			{
				if (arPages[iPage].pseudoClass == strRequestedPseudoClass)
				{
					var pageBoxWidth;
					var pageBoxHeight;
					if (Printer.orientation == "portrait")
					{
						pageBoxWidth = Printer.pageWidth * 10;
						pageBoxHeight = Printer.pageHeight * 10;
					}
					else
					{
						pageBoxWidth = Printer.pageHeight * 10;
						pageBoxHeight = Printer.pageWidth * 10;
					}
					var top = Printer.getPageMarginTop(arPages[iPage], pageBoxWidth, pageBoxHeight);
					var right = Printer.getPageMarginRight(arPages[iPage], pageBoxWidth, pageBoxHeight);
					var bottom = Printer.getPageMarginBottom(arPages[iPage], pageBoxWidth, pageBoxHeight);
					var left = Printer.getPageMarginLeft(arPages[iPage], pageBoxWidth, pageBoxHeight);
					if (top != null)
					{
						var topImportant = Printer.getPageMarginTopImportant(arPages[iPage]);
						if (topImportant || !hadTopImportant)
						{
							oAuthorSpecifiedMargins.top = top / 1000;
							hadTopImportant |= topImportant;
						}
					}
					if (right != null)
					{
						var rightImportant = Printer.getPageMarginRightImportant(arPages[iPage]);
						if (rightImportant || !hadRightImportant)
						{
							oAuthorSpecifiedMargins.right = right / 1000;
							hadRightImportant |= rightImportant;
						}
					}
					if (bottom != null)
					{
						var bottomImportant = Printer.getPageMarginBottomImportant(arPages[iPage]);
						if (bottomImportant || !hadBottomImportant)
						{
							oAuthorSpecifiedMargins.bottom = bottom / 1000;
							hadBottomImportant |= bottomImportant;
						}
					}
					if (left != null)
					{
						var leftImportant = Printer.getPageMarginLeftImportant(arPages[iPage]);
						if (leftImportant || !hadLeftImportant)
						{
							oAuthorSpecifiedMargins.left = left / 1000;
							hadLeftImportant |= leftImportant;
						}
					}
				}
			}
		}
	}
	return oAuthorSpecifiedMargins;
}
function CompareMarginObjects(oMarginObject1, oMarginObject2)
{
	if (oMarginObject1 == null && oMarginObject2 == null)
	{
		return true;
	}
	else if (oMarginObject1 == null && oMarginObject2 != null)
	{
		return false;
	}
	else if (oMarginObject1 != null && oMarginObject2 == null)
	{
		return false;
	}
	else
	{
		if (CompareIndividualMargins(oMarginObject1.left, oMarginObject2.left) &&
			CompareIndividualMargins(oMarginObject1.right, oMarginObject2.right) &&
			CompareIndividualMargins(oMarginObject1.top, oMarginObject2.top) &&
			CompareIndividualMargins(oMarginObject1.bottom, oMarginObject2.bottom))
		{
			return true;
		}
		else
		{
			return false;
		}
	}
}
function CompareIndividualMargins(oMargin1, oMargin2)
{
	if (oMargin1 == null && oMargin2 == null)
	{
		return true;
	}
	else if (oMargin1 == null && oMargin2 != null)
	{
		return false;
	}
	else if (oMargin1 != null && oMargin2 == null)
	{
		return false;
	}
	else if (oMargin1 != oMargin2)
	{
		return false;
	}
	else
	{
		return true;
	}
}
function ApplyAuthorSpecifiedMargins(strAuthorPagePropertiesType, oAuthorSpecifiedMargins)
{
	if (strAuthorPagePropertiesType != "AtPage" && strAuthorPagePropertiesType != "AtPageLeft" && strAuthorPagePropertiesType != "AtPageRight" && strAuthorPagePropertiesType != "AtPageFirst")
	{
		HandleError("Invalid Author Specified Page Type", document.URL, "CPrintDoc::ProcessAuthorSpecifiedPageProperties");
		return null;
	}
	var strSelectorName = ".mRect" + strAuthorPagePropertiesType;
	var oRule = GetRuleFromSelector(strSelectorName);
	if (oRule == null)
	{
		HandleError(strSelectorName + " rule does not exist!", document.URL, "CPrintDoc::ProcessAuthorSpecifiedPageProperties");
		return null;
	}
	if (oAuthorSpecifiedMargins.left != null) oRule.style.marginLeft = oAuthorSpecifiedMargins.left == null ? "" : oAuthorSpecifiedMargins.left + "in";
	if (oAuthorSpecifiedMargins.right != null) oRule.style.marginRight = oAuthorSpecifiedMargins.right == null ? "" : oAuthorSpecifiedMargins.right + "in";
	if (oAuthorSpecifiedMargins.top != null) oRule.style.marginTop = oAuthorSpecifiedMargins.top == null ? "" : oAuthorSpecifiedMargins.top + "in";
	if (oAuthorSpecifiedMargins.bottom != null) oRule.style.marginBottom = oAuthorSpecifiedMargins.bottom == null ? "" : oAuthorSpecifiedMargins.bottom + "in";
	strSelectorName = ".divHead" + strAuthorPagePropertiesType;
	oRule = GetRuleFromSelector(strSelectorName);
	if (oRule != null)
	{
		if (oAuthorSpecifiedMargins.left != null) oRule.style.left = oAuthorSpecifiedMargins.left == null ? "" : oAuthorSpecifiedMargins.left + "in";
	}
	strSelectorName = ".divFoot" + strAuthorPagePropertiesType;
	oRule = GetRuleFromSelector(strSelectorName);
	if (oRule != null)
	{
		if (oAuthorSpecifiedMargins.left != null) oRule.style.left = oAuthorSpecifiedMargins.left == null ? "" : oAuthorSpecifiedMargins.left + "in";
	}
	return null;
}
function ExtractNumericValueFromMarginStyleOfLayoutRectangle(strMarginStyle)
{
	var value = null;
	if (strMarginStyle == null || strMarginStyle.length == 0)
	{
		value = null;
	}
	else if (strMarginStyle.length == 1)
	{
		if (strMaginStyle.charAt(0) == '0')
		{
			value = 0;
		}
		else
		{
			value = null;
		}
	}
	else if (strMarginStyle.length < 3)
	{
		value = null;
	}
	else
	{
		var chLast = strMarginStyle.charAt(strMarginStyle.length - 1);
		var chBeforeLast = strMarginStyle.charAt(strMarginStyle.length - 2);
		if ( (chBeforeLast == 'i' || chBeforeLast == 'I' ) && (chLast == 'n' || chLast == 'N' ))
		{
			value = new Number(strMarginStyle.substr(0, strMarginStyle.length - 2));
		}
		else
		{
			HandleError("Unexpected unit", document.URL, "ExtractNumericValueFromMarginStyleOfLayoutRectangle");
			value = null;
		}
	}
	return value;
}
CPrintDoc.prototype.RectComplete = CPrintDoc_RectComplete;
CPrintDoc.prototype.AddPage = CPrintDoc_AddPage;
CPrintDoc.prototype.AddFirstPage = CPrintDoc_AddFirstPage;
CPrintDoc.prototype.AddTableOfLinks = CPrintDoc_AddTableOfLinks;
CPrintDoc.prototype.FixupHF = CPrintDoc_FixupHF;
CPrintDoc.prototype.StopFixupHF = CPrintDoc_StopFixupHF;
CPrintDoc.prototype.TickHF = CPrintDoc_TickHF;
CPrintDoc.prototype.InitDocument = CPrintDoc_InitDocument;
CPrintDoc.prototype.ResetDocument = CPrintDoc_ResetDocument;
CPrintDoc.prototype.ResetTableOfLinks = CPrintDoc_ResetTableOfLinks;
CPrintDoc.prototype.BuildAllLinkedDocuments = CPrintDoc_BuildAllLinkedDocuments;
CPrintDoc.prototype.BuildAllFrames = CPrintDoc_BuildAllFrames;
CPrintDoc.prototype.CreateSubDocument = CPrintDoc_CreateSubDocument;
CPrintDoc.prototype.Print = CPrintDoc_Print;
CPrintDoc.prototype.PrintAllSubDocuments = CPrintDoc_PrintAllSubDocuments;
CPrintDoc.prototype.ReadyToPrint = CPrintDoc_ReadyToPrint;
CPrintDoc.prototype.Page = CPrintDoc_Page;
CPrintDoc.prototype.Pages = CPrintDoc_Pages;
CPrintDoc.prototype.EnsureURL = CPrintDoc_EnsureURL;
CPrintDoc.prototype.EnsureTitle = CPrintDoc_EnsureTitle;
