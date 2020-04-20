--Split 表函数将一个字符串按指定分隔符进行分割，返回一个表。
create function split(
	@string varchar(255),--待分割字符串
	@separator varchar(255)--分割符
)returns @array table(item varchar(255))
as
begin
	declare @begin int,@end int,@item varchar(255)
	set @begin = 1
	set @end=charindex(@separator,@string,@begin)
	while(@end<>0)
	begin
		set @item = substring(@string,@begin,@end-@begin)
		insert into @array(item) values(@item)
		set @begin = @end+1
		set @end=charindex(@separator,@string,@begin)
	end
	set @item = substring(@string,@begin,len(@string)+1-@begin)
	if (len(@item)>0)
		insert into @array(item) values(substring(@string,@begin,len(@string)+1-@begin))
	return
end


SELECT
	stuff(
		( SELECT '+' + [CV_VALUE_TEXT] FROM [dbo].[SD_ITEM_CV_DICT] 
            WHERE CV_CODE = 'HLYWTYM' AND CV_VALUE IN ( select * from dbo.split('2#10','#') ) FOR xml path ( '' ) ), 1,1,'' 
        );