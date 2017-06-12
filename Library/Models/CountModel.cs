using System.Collections.Generic;

namespace Library.Models
{
    public class CountModel<T>
    {
        public object Info { get; set; }
        public int Total { get; set; }

        public IEnumerable<T> Items { get; set; }
    }
}