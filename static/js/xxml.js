<script language="javascript">
function movenext()
{
if (xmldso.recordset.absoluteposition < xmldso.recordset.recordcount)
{
xmldso.recordset.movenext();
}
}
function moveprevious()
{
if (xmldso.recordset.absoluteposition > 1)
{
xmldso.recordset.moveprevious();
}
}
</script>