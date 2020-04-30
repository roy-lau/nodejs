#include <iostream>
#include <stdlib.h> // 这里存着 system() 函数
using namespace std;
// 要求：
// 1. 提示用户输入一个整数，将该整数分别以8进制，10进制，16进制打印在屏幕上
// 2. 提示用户输入一个布尔值（0或1），以布尔方式将值打印在屏幕上
int main(){
	cout << "请输入一个整数："<< endl;
	int x = 0;
	cin >> x;
	cout << oct << x << endl; // 8进制
	cout << dec << x << endl; // 10进制
	cout << hex << x << endl; // 16进制
	cout << "请输入一个布尔值(0 or 1):" << endl;
	bool y = false;
	cin >> y;
	cout << boolalpha << y << endl;
	system("pause");
	return 0;
}