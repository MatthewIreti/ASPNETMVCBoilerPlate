using Newtonsoft.Json;

namespace Library.Models
{
    public class OrderExpression
    {
        public int Direction { get; set; }
        public int Column { get; set; }

        public static OrderExpression Deserilizer(string orderExpression)
        {
            OrderExpression orderDeserilizer = null;
            if (orderExpression != null)
            {
                orderDeserilizer = JsonConvert.DeserializeObject<OrderExpression>(orderExpression);
            }
            return orderDeserilizer ?? new OrderExpression();
        }
    }
}