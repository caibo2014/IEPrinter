#pragma once
#include <string>
using namespace std;

class CPrintTemplate
{
private:
	CPrintTemplate();
	static CPrintTemplate* m_Instance;
	static string _DEFAULT_PRINT_TEMPLATE_FILE_NAME;
public:
	static CPrintTemplate* getInstance();
	~CPrintTemplate();
	/*
	�����ļ�������ȡIE��ӡģ���ļ��ĵ�ַ��Windowsƽ̨�ļ�·����
	�ļ�·����Ϊ���¼��������
	1����һ�ļ���(�磺PrintTemplate.htm)����ֱ��ʹ����Ŀ·��+�ļ���
	2������·�����磺C:\\Users\\Administrator\\Desktop\\ActiveXTest.html):��ֱ�ӷ��ظ�·��
	3��Զ��·�����磺http://....//PrintTemplate.htm������ʹ��IE���ظ���Դ�����ز����ش洢·����age��֤��
	4����·�����磺""(�մ�)�����򷵻�Ĭ�ϵĴ�ӡģ���·��
	*/
	string getPath(string filename);

	/*
	��ӡ��Ӧ�Ľڵ�ID
	*/
	string getPath(string elementId,string filename);
};

