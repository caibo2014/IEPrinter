// CPrinter.cpp : CCPrinter 的实现
#include "stdafx.h"
#include "CPrinter.h"
#include <fstream>
#include "mshtmcid.h"


// CCPrinter

/*
	调用打印
	打印的参数应该在打印前通过属性设置
	
	参数：
		printMode：打印模式，默认为直接异步打印
		result:输出结果信息，如果为异步打印则只输出是否将打印信息请求推送给IE浏览器
*/
STDMETHODIMP CCPrinter::print(LONG printMode, BSTR* result)
{

	//获取模板文件路径地址
	string printTemplatePathStr = CPrintTemplate::getInstance()->getPath("");

	//获取浏览器命名对象
	IOleCommandTarget* pCmdTarg = this->getIOleCommandTarget();

	//执行打印
	this->doPrint(pCmdTarg, printTemplatePathStr,false,true);
	return S_OK;
}


IOleCommandTarget* CCPrinter::getIOleCommandTarget(){
	//CComQIPtr<IHTMLDocument2> HTMLDoc;
	CComPtr<IOleClientSite> ClientSite;
	CComPtr<IOleContainer> Container;
	CComQIPtr<IWebBrowser2> WebBrowser;
	IOleCommandTarget* pCmdTarg;
	this->GetClientSite((IOleClientSite **)&ClientSite);
	ClientSite->GetContainer(&Container);
	Container->QueryInterface(IID_IOleCommandTarget, (void**)&pCmdTarg);
	return pCmdTarg;
}


bool CCPrinter::doPrint(IOleCommandTarget* target, string printTemplatePathStr, bool printOrPreview = true, bool dontPromptUser = true){
	
	//将路径解析为宽字符
	std::wstring widestr = std::wstring(printTemplatePathStr.begin(), printTemplatePathStr.end());
	const wchar_t* printTemplatePath = widestr.c_str();
	
	//获取浏览器命名对象
	IOleCommandTarget* pCmdTarg = this->getIOleCommandTarget();

	DWORD nCmdID;
	DWORD nCmdexecopt;
	if (printOrPreview){
	    //如果是直接打印
		nCmdID = IDM_PRINT;
	}
	else{
		nCmdID = IDM_PRINTPREVIEW;
	}
	if (dontPromptUser){
		//如果是不提示用户（即不弹出Windows的打印对话框）
		nCmdexecopt = OLECMDEXECOPT_DONTPROMPTUSER;
	}
	else{
		nCmdexecopt = OLECMDEXECOPT_PROMPTUSER;
	}

	VARIANT vTemplatePath;
	V_VT(&vTemplatePath) = VT_BSTR;
	V_BSTR(&vTemplatePath) = SysAllocString(printTemplatePath);
	pCmdTarg->Exec(&CGID_MSHTML,
		nCmdID,
		nCmdexecopt,
		&vTemplatePath,
		NULL);
	return true;
}