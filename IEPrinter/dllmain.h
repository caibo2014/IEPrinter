// dllmain.h : 模块类的声明。

class CIEPrinterModule : public ATL::CAtlDllModuleT< CIEPrinterModule >
{
public :
	DECLARE_LIBID(LIBID_IEPrinterLib)
	DECLARE_REGISTRY_APPID_RESOURCEID(IDR_IEPRINTER, "{2857BF9B-6396-47D9-9F67-38FB236D741F}")
};

extern class CIEPrinterModule _AtlModule;
