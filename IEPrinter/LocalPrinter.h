#pragma once
class CLocalPrinter
{

private:
	//存储打印机当前（未开始打印之前）的状态
	PRINTER_INFO_2 *currentPrintSetting;

public:
	CLocalPrinter();
	~CLocalPrinter();
	bool setPrinter(PRINTER_INFO_2 *printInfo2);

};

