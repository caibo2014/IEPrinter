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
	//简单实现,不考虑线程安全，实例释放等因素
	/*
	我在stackoverflow（http://stackoverflow.com/questions/1008019/c-singleton-design-pattern）
	上看到这样的实现方式
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
	return "";
}
