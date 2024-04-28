using DeliveryManagement.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Moq;
using System.Numerics;

namespace DeliveryManagement.Tests
{
    public class OrderTests
    {

        [Fact]
        public void CreationTest()
        {
            var v = new Vector3(1, 2, 3);
            var s = string.Join(",", new float[3] { v.X, v.Y, v.Z});
            Assert.Equal("1,2,3", s);
        }
    }
}