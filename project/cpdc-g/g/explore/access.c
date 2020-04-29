
#include <iostream>
using namespace std;
/*#import生成文件 msado15.tlh，默认是有namespace ADODB {}所有内容都包在这个名字空间中。
用了no_namespace则生成的头文件中没有namespace，所有内容是全局的,否则ADODB.Connection
rename的意思就是改名了，rename("EOF","adoEOF")将EOF改名为adoEOF，以免和C语言里的EOF重名*/
#import "c:\program files\common files\system\ado\msado15.dll" no_namespace rename("EOF", "adoEOF")

void main()
{
    CoInitialize(NULL); //初始化OLE/COM库环境
    //在引入ado并初始化成功com库后，就可以使用智能指针了
    _ConnectionPtr m_pConnection;
    _RecordsetPtr m_pRecordset;
    HRESULT hr;
    try
    {
        hr = m_pConnection.CreateInstance("ADODB.Connection"); ///创建Connection对象
        //     hr = m_pConnection.CreateInstance(__uuidof(Connection));//no_namespace的好处

        if (SUCCEEDED(hr))
        {
            hr = m_pConnection->Open("Provider=Microsoft.Jet.OLEDB.4.0;Data Source=test.mdb", "", "", adModeUnknown); //access2003
            // hr = m_pConnection->Open("Provider=Microsoft.ACE.OLEDB.12.0;Data Source=test.accdb","","",adModeUnknown);    //access2007
            printf("成功连接数据库\n");
        }
    }
    catch (_com_error e) ///捕捉异常
    {
        printf("连接数据库失败!\n");
        return;
    }
    m_pRecordset.CreateInstance(__uuidof(Recordset)); //实例化结果集对象
                                                      //执行sql语句
    try
    {
        char sql[300];
        memset(sql, 0, 300);
        strcat(sql, "SELECT * FROM lyrtest");
        m_pRecordset->Open(sql, m_pConnection.GetInterfacePtr(), adOpenDynamic, adLockOptimistic, adCmdText);
    }
    catch (_com_error *e)
    {
        wprintf(e->ErrorMessage());
        if (m_pConnection->State)
        {
            m_pConnection->Close();
            m_pConnection = NULL;
        }
        CoUninitialize();
        return;
    }
    try
    {
        //若结果为空，结束
        if (m_pRecordset->BOF)
        {
            printf("表内数据为空！");
            if (m_pConnection->State)
            {
                m_pRecordset->Close();
                m_pRecordset = NULL;
                m_pConnection->Close();
                m_pConnection = NULL;
            }
            CoUninitialize();
            return;
        }
        cout << "---------------------------------" << endl;
        cout << "数据库的内容为:" << endl;
        //游标定位到第一条记录
        m_pRecordset->MoveFirst();
        _variant_t var[2]; //从结果集中取出的数据放到var中
        char *t1[2];
        while (!m_pRecordset->adoEOF)
        {
            var[0] = m_pRecordset->GetCollect("ID");
            if (var[0].vt != VT_NULL)
            {
                t1[0] = _com_util::ConvertBSTRToString((_bstr_t)var[0]);
            }
            printf(t1[0]);
            printf("\t");
            var[1] = m_pRecordset->GetCollect("Name");
            if (var[1].vt != VT_NULL)
            {
                t1[1] = _com_util::ConvertBSTRToString((_bstr_t)var[1]);
            }
            printf(t1[1]);
            printf("\n");
            m_pRecordset->MoveNext();
        }
    }
    catch (_com_error *e)
    {
        wprintf(e->ErrorMessage());
    }

    //退出程序时的处理
    if (m_pConnection->State)
    {
        m_pRecordset->Close();
        m_pRecordset = NULL;
        m_pConnection->Close();
        m_pConnection = NULL;
    }
    CoUninitialize();
    cout << "---------------------------------" << endl;
    return;
}