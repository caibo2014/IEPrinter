#include "stdafx.h"
#include "resource.h"
#include "PrintTemplate.h"

string CPrintTemplate::_DEFAULT_PRINT_TEMPLATE_FILE_NAME = "PrintTemplate.htm";
CPrintTemplate* CPrintTemplate::m_Instance = NULL;

CPrintTemplate::CPrintTemplate()
{
}


CPrintTemplate::~CPrintTemplate()
{
}

CPrintTemplate* CPrintTemplate::getInstance(){
	//��ʵ��,�������̰߳�ȫ��ʵ���ͷŵ�����
	/*
	����stackoverflow��http://stackoverflow.com/questions/1008019/c-singleton-design-pattern��
	�Ͽ���������ʵ�ַ�ʽ
	static S& getInstance()
	{
		static S   instance; 
		return instance;
	}
	*/
	if (m_Instance == NULL){
		m_Instance = new CPrintTemplate();
	}
	return m_Instance;
}


string CPrintTemplate::getPath(string filename){
	return this->getPath("", filename);
}

string CPrintTemplate::getPath(string elementId, string filename){
	//���ؿմ���ʱ�򣬻�ʹ��IEĬ�ϵĴ�ӡģ��
	//return "";
	return "res://IEPrinter.dll/printTemplate.htm";
}
