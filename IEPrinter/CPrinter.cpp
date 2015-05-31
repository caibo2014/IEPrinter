// CPrinter.cpp : CCPrinter ��ʵ��
#include "stdafx.h"
#include "CPrinter.h"
#include <fstream>
#include "mshtmcid.h"


// CCPrinter

/*
	���ô�ӡ
	��ӡ�Ĳ���Ӧ���ڴ�ӡǰͨ����������
	
	������
		printMode����ӡģʽ��Ĭ��Ϊֱ���첽��ӡ
		result:��������Ϣ�����Ϊ�첽��ӡ��ֻ����Ƿ񽫴�ӡ��Ϣ�������͸�IE�����
*/
STDMETHODIMP CCPrinter::print(LONG printMode, BSTR* result)
{

	//��ȡģ���ļ�·����ַ
	string printTemplatePathStr = CPrintTemplate::getInstance()->getPath("");

	//��ȡ�������������
	IOleCommandTarget* pCmdTarg = this->getIOleCommandTarget();

	//ִ�д�ӡ
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
	
	//��·������Ϊ���ַ�
	std::wstring widestr = std::wstring(printTemplatePathStr.begin(), printTemplatePathStr.end());
	const wchar_t* printTemplatePath = widestr.c_str();
	
	//��ȡ�������������
	IOleCommandTarget* pCmdTarg = this->getIOleCommandTarget();

	DWORD nCmdID;
	DWORD nCmdexecopt;
	if (printOrPreview){
	    //�����ֱ�Ӵ�ӡ
		nCmdID = IDM_PRINT;
	}
	else{
		nCmdID = IDM_PRINTPREVIEW;
	}
	if (dontPromptUser){
		//����ǲ���ʾ�û�����������Windows�Ĵ�ӡ�Ի���
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