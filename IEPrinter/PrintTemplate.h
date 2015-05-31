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
	根据文件名来获取IE打印模板文件的地址（Windows平台文件路径）
	文件路径分为以下几种情况：
	1、单一文件名(如：PrintTemplate.htm)：则直接使用项目路径+文件名
	2、绝对路径（如：C:\\Users\\Administrator\\Desktop\\ActiveXTest.html):则直接返回该路径
	3、远程路径（如：http://....//PrintTemplate.htm）：则使用IE下载该资源到本地并返回存储路径（age验证）
	4、无路径（如：""(空串)）：则返回默认的打印模板的路径
	*/
	string getPath(string filename);

	/*
	打印对应的节点ID
	*/
	string getPath(string elementId,string filename);
};

