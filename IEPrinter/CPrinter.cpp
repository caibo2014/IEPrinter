// CPrinter.cpp : CCPrinter 的实现
#include "stdafx.h"
#include "CPrinter.h"


// CCPrinter

/*
	调用打印
	打印的参数应该在打印前通过属性设置
	
	参数：
		printMode：打印模式，默认为直接异步打印
		result:输出结果信息，如果为异步打印则只输出是否将打印信息请求推送给IE浏览器
*/
STDMETHODIMP CCPrinter::print(LONG printMode = 0, BSTR* result)
{

	return S_OK;
}
