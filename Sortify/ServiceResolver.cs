using Castle.MicroKernel.Registration;
using Castle.Windsor;
using Castle.Windsor.MsDependencyInjection;
using Microsoft.Extensions.DependencyInjection;
using Sortify.Handlers.QueryHandlers;
using System;

namespace Sortify
{
    public class ServiceResolver
    {
        private static WindsorContainer container;
        private static IServiceProvider serviceProvider;

        public ServiceResolver(IServiceCollection services)
        {
            container = new WindsorContainer();

            var assemblyName = typeof(ICommandHandler).Assembly.FullName;

            container.Register(Classes.FromAssemblyNamed(assemblyName)
                .IncludeNonPublicTypes()
                .BasedOn(typeof(ICommandHandler)).WithServiceAllInterfaces().LifestyleTransient());

            container.Register(Classes.FromAssemblyNamed(assemblyName)
                .IncludeNonPublicTypes()
                .BasedOn(typeof(IQueryHandler)).WithServiceAllInterfaces().LifestyleTransient());

            serviceProvider = WindsorRegistrationHelper.CreateServiceProvider(container, services);
        }

        public IServiceProvider GetServiceProvider()
        {
            return serviceProvider;
        }
    }
}
