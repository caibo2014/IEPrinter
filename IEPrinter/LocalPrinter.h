#pragma once
class CLocalPrinter
{

private:
	//�洢��ӡ����ǰ��δ��ʼ��ӡ֮ǰ����״̬
	PRINTER_INFO_2 *currentPrintSetting;

public:
	CLocalPrinter();
	~CLocalPrinter();
	bool setPrinter(PRINTER_INFO_2 *printInfo2);

};

